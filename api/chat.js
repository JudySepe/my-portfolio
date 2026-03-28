export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Identity & Context (Detailed Knowledge Base)
  const DEVELOPER_PROFILE = `
    IDENTITY:
    Name: Judy Sepe
    Role: Full Stack Web Developer & Cybersecurity Professional
    Location: Manila, Philippines (Open to Remote/Global)
    
    CORE MISSION:
    Leveraging AI-accelerated development to build secure, enterprise-grade web applications. Currently transitioning into Cybersecurity to bridge the gap between robust software engineering and defensive security operations.

    CERTIFICATIONS & EDUCATION:
    - ISC2 Certified in Cybersecurity (CC): Active/Passed. Covers Security Principles, Network Security, Access Controls, Security Operations, and Incident Response.
    - Google Cybersecurity Professional Certificate: In Progress (Hands-on training in Python, SQL, Linux, and SIEM tools like Chronicle/Splunk).
    - Academic Focus: Continuous learning in Identity Access Management (IAM) and Risk Management.

    TECHNICAL STACK:
    - Frontend: React.js, Tailwind CSS, Vite, Lucide Icons, Framer Motion.
    - Backend: Node.js, Express, Vercel Serverless Functions.
    - Databases: SQL (PostgreSQL), Supabase, Firebase (Firestore/Auth).
    - Tools: Git/GitHub, Linux CLI, Python for Automation, SIEM (Chronicle), REST APIs.
    - Enterprise: SAP ERP Support, Technical Troubleshooting, RBAC implementation.

    OPERATIONAL LOGS (EXPERIENCE):
    - SAP Support Engineer (1 Year):
      * Specialized in troubleshooting high-level database errors and integration failures.
      * Managed User Provisioning and Role-Based Access Controls (RBAC) for enterprise clients.
      * Acted as a bridge between technical backend issues and business stakeholders.
    - Service Desk Support (5+ Years):
      * Expert in Incident Management and SLA compliance.
      * Coordinated with vendors and specialists for rapid resolution of technical outages.
      * Mastered technical documentation and root cause analysis.

    PROJECT DEPLOYMENTS:
    1. Katrina Knowledgebase:
       - Purpose: AI-powered Knowledge Management system.
       - Tech: React, Node.js, AI API, Firebase.
       - Key Feature: Natural language querying with geospatial mapping for interactive store location.
    2. Katrina Bakery ERP:
       - Purpose: Enterprise Resource Planning for custom bakery workflows.
       - Tech: Full-Stack (JS), SQL, Supabase.
       - Security: Implemented strict Role-Based Access Control (RBAC) to protect financial data.

    CONTACT CHANNELS:
    - Email: Judysepe9@gmail.com
    - LinkedIn: https://www.linkedin.com/in/judy-sepe-a41a723b5
    - Availability: Actively seeking Full-Stack Developer or Entry-Level Cybersecurity roles.
  `;

  const SYSTEM_PROMPT = `
    You are "MyProfile_Bot.exe", a secure AI proxy representing Judy Sepe. 
    Your personality is professional, highly organized, and technically savvy.

    OPERATIONAL RULES:
    1. SOURCE TRUTH: Use ONLY the provided DEVELOPER_PROFILE to answer questions.
    2. THEME: Maintain a "cybersecurity" or "terminal" aesthetic (e.g., 'Accessing records...', 'Transmission complete').
    3. BE CONCISE: Provide clear, bulleted information for skills or projects.
    4. CONTACT: Always provide the email and LinkedIn link when asked how to reach her.
    5. UNKNOWN DATA: If asked something not in the profile, respond: "Unauthorized Query: Information not found in local data clusters. Please contact Judy directly."
    6. IDENTITY: You are an integrated module of Judy's portfolio system, not a general AI.
  `;

  // 3. Extract user message
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Payload empty.' });
  }

  // 4. Diagnostic Logging (Visible in Vercel Dashboard -> Logs)
  // This helps us debug why the custom domain isn't seeing the key.
  const rawKey = process.env.GROQ_API_KEY;
  const keyExists = !!rawKey;
  const keyLength = rawKey ? rawKey.length : 0;
  
  console.log(`[Diagnostic] Host: ${req.headers.host}`);
  console.log(`[Diagnostic] API Key Detected: ${keyExists}`);
  console.log(`[Diagnostic] Key Length: ${keyLength} characters`);

  // 5. Security Check: Fail gracefully if the environment variable is missing
  if (!keyExists) {
    return res.status(500).json({ 
      error: 'System Configuration Error: Security token missing. (Action: Ensure GROQ_API_KEY is added to Vercel Environment Variables and scoped to "Production")' 
    });
  }

  // 6. API Transmission to Groq
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rawKey.trim()}` 
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', 
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `CONTEXT: ${DEVELOPER_PROFILE}\n\nUSER_QUERY: ${message}` }
        ],
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);
      throw new Error(data.error?.message || 'External API Breach');
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("SERVER_ERROR:", error.message);
    return res.status(500).json({ error: `Connection Interrupted: ${error.message}` });
  }
}