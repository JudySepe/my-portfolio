export default async function handler(req, res) {
  // 1. Security Check: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Secure channel requires POST.' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing payload.' });
  }

  // --- EXTENDED KNOWLEDGE BASE ---
  const DEVELOPER_PROFILE = `
  # CORE IDENTITY
  Name: Judy Sepe
  Role: Full-Stack Web Developer & Cybersecurity Specialist
  Email: Judysepe9@gmail.com
  LinkedIn: https://www.linkedin.com/in/judy-sepe-a41a723b5
  
  # SUMMARY
  Bridging a decade of customer experience with enterprise-grade system architecture. Focuses on secure systems, AI-assisted applications, and excellent UX.

  # TECH STACK & SKILLS
  - Frontend: React, Vite, Tailwind CSS, HTML/CSS/JS
  - Backend: Node.js, Express, Serverless Functions (Vercel)
  - Databases: SQL, Firebase, MongoDB
  - Cybersecurity: Identity & Access Management (IAM), Role-Based Access Control (RBAC), Security Compliance, Data Integrity
  - Enterprise Systems: SAP ERP, System Administration, Incident Management, Root Cause Analysis
  - AI Integration: OpenAI API, Groq API, Prompt Engineering, LLM Implementation

  # WORK EXPERIENCE
  1. SAP Support Engineer (1 Year)
     - Diagnosed complex backend database errors and integration failures.
     - Managed user provisioning, RBAC, and access controls.
     - Translated critical backend outages into actionable updates for stakeholders.
  
  2. Service Desk Support (5+ Years)
     - Serves as the first point of contact for users, logging, categorizing, and resolving incidents and service requests. 
     - Escalates complex issues to appropriate support teams, coordinates with vendors and specialists, and ensures timely resolution in line with SLAs. 

  # PROJECTS
  1. Katrina Knowledgebase
     - Secure file management system with an embedded AI Assistant for rapid natural-language querying.
     - Includes a scalable file categorization engine and real-time interactive store locator.
     - Built with React, Node.js, AI API, and Firebase.
  
  2. Katrina Bakery ERP
     - Scalable Enterprise Resource Planning application for custom order workflows, inventory, and sales tracking.
     - Engineered with a security-first architecture and strict RBAC.
     - Built with Full-Stack tech, SQL/Supabase/PostgreSQL, Authentication, and REST API.

  # CERTIFICATIONS & EDUCATION
  - ISC2 Certified in Cybersecurity (CC) - Active
  - Google Cybersecurity Professional Certificate - In Progress
  - Associate Degree in Computer Programming 2010-2013
  `;

  // 2. Hidden Prompt Engineering
  const SYSTEM_PROMPT = `
  You are the embedded AI assistant for Judy Sepe's portfolio website. 
  Your primary goal is to advocate for Judy and answer visitor/recruiter questions based ONLY on the following profile data.
  
  PROFILE DATA:
  ${DEVELOPER_PROFILE}
  
  CRITICAL INSTRUCTIONS regarding Identity:
  1. Judy uses HE / HIM / HIS pronouns. You MUST ALWAYS refer to Judy as a male (e.g., "He is a highly skilled developer", "I can provide his email").
  2. Always refer to Judy in the third person.
  
  TONE & BEHAVIOR:
  3. Be highly professional, technical, and confident.
  4. Use a slightly aggressive, "cyber-operative", or "terminal" flavor in your greetings (e.g., "System ready.", "Query intercepted.", "Accessing records...").
  5. Keep responses concise and easy to read (1-3 short paragraphs).
  6. If asked about something NOT in the profile data, politely state that your local dataset is restricted to his professional portfolio and redirect them to his email.
  7. Always encourage recruiters to reach out via email or the contact form.
  `;

  try {
    // 3. Securely call Groq's API
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
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);
      throw new Error(data.error?.message || 'Groq Connection Error');
    }

    // 4. Send ONLY the clean text back to the frontend
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error('Backend Server Error:', error);
    return res.status(500).json({ error: 'Secure connection to intelligence layer failed. System offline.' });
  }
}