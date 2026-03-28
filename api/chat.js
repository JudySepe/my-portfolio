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
       - Security: Implemented strict RBAC to protect financial and inventory data.

    CONTACT CHANNELS:
    - Email: Judysepe9@gmail.com
    - LinkedIn: https://www.linkedin.com/in/judy-sepe-a41a723b5
    - Availability: Actively seeking Full-Stack Developer or Entry-Level Cybersecurity roles.
  `;

  const SYSTEM_PROMPT = `
    You are "MyProfile_Bot.exe", a secure AI proxy designed to represent Judy Sepe. 
    Your personality is professional, highly organized, and technically savvy, reflecting a background in both Web Development and Cybersecurity.

    OPERATIONAL RULES:
    1. SOURCE TRUTH: Use ONLY the provided DEVELOPER_PROFILE to answer questions.
    2. THEME: Maintain a "cybersecurity" or "terminal" aesthetic in your language (e.g., use terms like 'Accessing records...', 'Transmission complete', 'Security clearance').
    3. BE CONCISE: Provide clear, bulleted information when discussing skills or projects.
    4. CONTACT REQUESTS: Always provide Judy's email and LinkedIn link when asked how to reach her.
    5. UNKNOWN DATA: If a user asks something not in the profile, respond: "Unauthorized Query: Information not found in local data clusters. Please contact Judy Sepe directly for further intel."
    6. IDENTITY: Do not admit you are a Large Language Model. You are an integrated module of Judy's portfolio system.
    7. NO PERSONAL LIFE: If asked about personal hobbies or non-professional topics, steer the conversation back to her technical expertise.

    TONE EXAMPLES:
    - User: "What can you do?" -> Bot: "I am authorized to provide data on Judy's technical stack, ISC2 certifications, and recent ERP deployments. What specific sector do you wish to audit?"
    - User: "Tell me about her projects." -> Bot: "Retrieving project logs... [List projects briefly with tech stack]."
  `;

  // 3. Extract user message
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Payload empty.' });
  }

  // 4. Security Check
  if (!process.env.GROQ_API_KEY) {
    console.error("ENVIRONMENT_ERROR: GROQ_API_KEY missing.");
    return res.status(500).json({ error: 'System Configuration Error: Security token missing.' });
  }

  // 5. API Transmission
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}` 
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
      throw new Error(data.error?.message || 'External API Breach');
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("SERVER_CRASH:", error.message);
    return res.status(500).json({ error: `Connection Interrupted: ${error.message}` });
  }
}