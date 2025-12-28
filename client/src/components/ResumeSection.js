import React, { useState, useEffect, useRef } from "react";
import { TEMPLATE_LIST } from "./templates";
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ---------------- TEMPLATES (content) ----------------
const RESUME_TEMPLATES = [
  {
    id: "mern_fresher",
    label: "MERN Full‑Stack Fresher",
    basic: {
      title: "Full‑Stack Developer (MERN)",
      location: "Hyderabad, India",
    },
    summary:
      "Final-year CSE student with hands-on experience building full-stack web apps using React, Node.js, Express, and MongoDB. Comfortable working with REST APIs, authentication, and deployment.",
    skills:
      "JavaScript, React, Node.js, Express, MongoDB, REST APIs, Git, HTML, CSS",
    education: {
      degree: "B.Tech in Computer Science and Engineering",
      school: "Your University",
      startYear: "2020",
      endYear: "2024",
    },
    workExperience: [
      {
        company: "Personal Project",
        position: "AI Mock Interview Web App",
        startDate: "2023",
        endDate: "2024",
        location: "Remote",
        description:
          "Built a MERN-based platform where users can practice interviews with an AI interviewer, get feedback, and track progress.",
      },
      {
        company: "Personal Project",
        position: "E‑Commerce Store (MERN)",
        startDate: "2022",
        endDate: "2023",
        location: "Remote",
        description:
          "Developed a full-stack e‑commerce app with user auth, product listing, cart, and order management using MongoDB and Express.",
      },
    ],
  },
  {
    id: "java_fresher",
    label: "Java Full‑Stack Fresher",
    basic: {
      title: "Java Full‑Stack Developer",
      location: "Bengaluru, India",
    },
    summary:
      "Entry-level Java full‑stack developer familiar with Spring Boot, REST APIs, and relational databases. Strong CS fundamentals and problem-solving skills.",
    skills:
      "Java, Spring Boot, REST APIs, MySQL, HTML, CSS, JavaScript, Git",
    education: {
      degree: "B.Tech in Information Technology",
      school: "Your University",
      startYear: "2020",
      endYear: "2024",
    },
    workExperience: [
      {
        company: "Personal Project",
        position: "Online Course Portal",
        startDate: "2023",
        endDate: "2024",
        location: "Remote",
        description:
          "Implemented user registration, course listing, and enrollment features using Spring Boot and MySQL.",
      },
      {
        company: "Personal Project",
        position: "Student Management System",
        startDate: "2022",
        endDate: "2023",
        location: "Remote",
        description:
          "Created CRUD dashboards for student records with secure login and role-based access.",
      },
    ],
  },
  {
    id: "data_fresher",
    label: "Data / ML Fresher",
    basic: {
      title: "Data Analyst / ML Enthusiast",
      location: "Remote / India",
    },
    summary:
      "Final‑year student with a strong interest in data analysis and machine learning. Experienced with Python, pandas, and basic ML models.",
    skills:
      "Python, pandas, NumPy, Matplotlib, Scikit-learn, SQL, Excel",
    education: {
      degree: "B.Sc in Computer Science",
      school: "Your University",
      startYear: "2020",
      endYear: "2024",
    },
    workExperience: [
      {
        company: "Personal Project",
        position: "Customer Churn Analysis",
        startDate: "2023",
        endDate: "2024",
        location: "Remote",
        description:
          "Analyzed telecom customer data and built a churn prediction model using logistic regression.",
      },
      {
        company: "Personal Project",
        position: "Sales Dashboard",
        startDate: "2022",
        endDate: "2023",
        location: "Remote",
        description:
          "Created a data visualization dashboard showing sales trends and KPIs using Python and Excel.",
      },
    ],
  },
  {
    id: "frontend_fresher",
    label: "Frontend Developer Fresher",
    basic: {
      title: "Frontend Developer",
      location: "Mumbai, India",
    },
    summary:
      "Passionate frontend developer with expertise in modern JavaScript frameworks and responsive design. Experienced in building interactive user interfaces and optimizing web performance.",
    skills:
      "JavaScript, React, Vue.js, HTML5, CSS3, Sass, TypeScript, Git, Webpack",
    education: {
      degree: "B.Tech in Computer Engineering",
      school: "Your University",
      startYear: "2020",
      endYear: "2024",
    },
    workExperience: [
      {
        company: "Personal Project",
        position: "React E-Commerce Website",
        startDate: "2023",
        endDate: "2024",
        location: "Remote",
        description:
          "Developed a modern e-commerce platform with React, featuring product catalog, shopping cart, and payment integration.",
      },
      {
        company: "Personal Project",
        position: "Portfolio Website",
        startDate: "2022",
        endDate: "2023",
        location: "Remote",
        description:
          "Created a responsive portfolio website showcasing projects with smooth animations and modern design principles.",
      },
    ],
  },
  {
    id: "python_fresher",
    label: "Python Developer Fresher",
    basic: {
      title: "Python Developer",
      location: "Delhi, India",
    },
    summary:
      "Enthusiastic Python developer with experience in web development, data processing, and automation. Proficient in Django, Flask, and various Python libraries for efficient software development.",
    skills:
      "Python, Django, Flask, PostgreSQL, MongoDB, REST APIs, Git, Linux, Docker",
    education: {
      degree: "B.Tech in Software Engineering",
      school: "Your University",
      startYear: "2020",
      endYear: "2024",
    },
    workExperience: [
      {
        company: "Personal Project",
        position: "Django Blog Platform",
        startDate: "2023",
        endDate: "2024",
        location: "Remote",
        description:
          "Built a full-featured blog platform with Django, including user authentication, rich text editing, and comment system.",
      },
      {
        company: "Personal Project",
        position: "Data Processing Automation",
        startDate: "2022",
        endDate: "2023",
        location: "Remote",
        description:
          "Developed Python scripts for automated data processing, ETL operations, and report generation for business analytics.",
      },
    ],
  },
  {
    id: "devops_fresher",
    label: "DevOps Engineer Fresher",
    basic: {
      title: "DevOps Engineer",
      location: "Pune, India",
    },
    summary:
      "DevOps enthusiast with hands-on experience in CI/CD pipelines, containerization, and cloud infrastructure. Knowledgeable in automation tools and infrastructure as code.",
    skills:
      "AWS, Docker, Kubernetes, Jenkins, Git, Linux, Bash, Terraform, Ansible, Python",
    education: {
      degree: "B.Tech in Computer Science",
      school: "Your University",
      startYear: "2020",
      endYear: "2024",
    },
    workExperience: [
      {
        company: "Personal Project",
        position: "CI/CD Pipeline Setup",
        startDate: "2023",
        endDate: "2024",
        location: "Remote",
        description:
          "Implemented complete CI/CD pipeline using Jenkins, Docker, and AWS for automated testing and deployment of web applications.",
      },
      {
        company: "Personal Project",
        position: "Infrastructure Automation",
        startDate: "2022",
        endDate: "2023",
        location: "Remote",
        description:
          "Created Terraform configurations for provisioning AWS infrastructure and Ansible playbooks for server configuration management.",
      },
    ],
  },
  // Add more templates as needed
];



// ---------------- COMPONENT ----------------
function ResumeSection({ token }) {
  const [basic, setBasic] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
  });
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState({
    school: "",
    degree: "",
    startYear: "",
    endYear: "",
  });
  const [workExperience, setWorkExperience] = useState([
    { company: "", position: "", startDate: "", endDate: "", location: "", description: "" },
    { company: "", position: "", startDate: "", endDate: "", location: "", description: "" },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedLayout, setSelectedLayout] = useState("classic");
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const previewRef = useRef(null);

  // load from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed.basic) setBasic(parsed.basic);
      if (parsed.summary) setSummary(parsed.summary);
      if (parsed.skills) setSkills(parsed.skills);
      if (parsed.education) setEducation(parsed.education);
      if (parsed.workExperience) setWorkExperience(parsed.workExperience);
      if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
      if (parsed.selectedLayout) setSelectedLayout(parsed.selectedLayout);
    } catch (e) {
      console.error("Failed to load resume from storage", e);
    }
  }, []);

  const saveToStorage = () => {
    const data = {
      basic,
      summary,
      skills,
      education,
      workExperience,
      selectedTemplate,
      selectedLayout,
    };
    localStorage.setItem("resumeData", JSON.stringify(data));
  };

  const clearAll = () => {
    setBasic({
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
    });
    setSummary("");
    setSkills("");
    setEducation({
      school: "",
      degree: "",
      startYear: "",
      endYear: "",
    });
    setWorkExperience([
      { company: "", position: "", startDate: "", endDate: "", location: "", description: "" },
      { company: "", position: "", startDate: "", endDate: "", location: "", description: "" },
    ]);
    setSelectedTemplate("");
    setSelectedLayout("classic");
    localStorage.removeItem("resumeData");
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasic((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    setWorkExperience((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const applyTemplate = (id) => {
    const tpl = RESUME_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;

    setSelectedTemplate(id);

    setBasic((prev) => ({
      ...prev,
      title: tpl.basic.title || prev.title,
      location: tpl.basic.location || prev.location,
    }));

    if (tpl.summary) setSummary(tpl.summary);
    if (tpl.skills) setSkills(tpl.skills);

    setEducation((prev) => ({
      ...prev,
      degree: tpl.education.degree || prev.degree,
      school: tpl.education.school || prev.school,
      startYear: tpl.education.startYear || prev.startYear,
      endYear: tpl.education.endYear || prev.endYear,
    }));

    setWorkExperience((prev) =>
      prev.map((exp, idx) => ({
        company: tpl.workExperience[idx]?.company || exp.company,
        position: tpl.workExperience[idx]?.position || exp.position,
        startDate: tpl.workExperience[idx]?.startDate || exp.startDate,
        endDate: tpl.workExperience[idx]?.endDate || exp.endDate,
        location: tpl.workExperience[idx]?.location || exp.location,
        description: tpl.workExperience[idx]?.description || exp.description,
      }))
    );
  };

  const skillList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const ActiveLayout =
    TEMPLATE_LIST.find((t) => t.id === selectedLayout)?.component ||
    TEMPLATE_LIST[0].component;

  const handleDownloadPDF = () => {
    if (!token) {
      alert("Please log in to download your resume.");
      return;
    }
    if (previewRef.current) {
      html2canvas(previewRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`${basic.name || 'resume'}.pdf`);
      }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      });
    } else {
      alert('Resume preview not available. Please fill in your details first.');
    }
  };

  const handleDownloadWord = () => {
    if (!token) {
      alert("Please log in to download your resume.");
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${basic.name || 'Resume'} - Resume</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: #fff;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .name {
              font-size: 28px;
              font-weight: bold;
              color: #007bff;
              margin: 0;
            }
            .title {
              font-size: 18px;
              color: #666;
              margin: 5px 0;
            }
            .contact {
              font-size: 14px;
              color: #888;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #007bff;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .skill-list {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            .skill-item {
              background: #f8f9fa;
              padding: 5px 10px;
              border-radius: 15px;
              font-size: 14px;
            }
            .experience-item {
              margin-bottom: 20px;
              padding-left: 20px;
              border-left: 3px solid #007bff;
            }
            .experience-title {
              font-weight: bold;
              font-size: 16px;
            }
            .experience-company {
              color: #666;
              font-size: 14px;
            }
            .experience-dates {
              color: #888;
              font-size: 12px;
            }
            .experience-description {
              margin-top: 10px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="name">${basic.name || 'Your Name'}</h1>
            <h2 class="title">${basic.title || 'Job Title'}</h2>
            <div class="contact">
              ${basic.email ? `Email: ${basic.email} | ` : ''}${basic.phone ? `Phone: ${basic.phone} | ` : ''}${basic.location ? `Location: ${basic.location}` : ''}
            </div>
          </div>

          ${summary ? `
          <div class="section">
            <h3 class="section-title">Professional Summary</h3>
            <p>${summary.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}

          ${skills ? `
          <div class="section">
            <h3 class="section-title">Skills</h3>
            <div class="skill-list">
              ${skills.split(',').map(skill => `<span class="skill-item">${skill.trim()}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          ${(education.degree || education.school) ? `
          <div class="section">
            <h3 class="section-title">Education</h3>
            <div class="experience-item">
              <div class="experience-title">${education.degree || ''}</div>
              <div class="experience-company">${education.school || ''}</div>
              <div class="experience-dates">${education.startYear || ''} - ${education.endYear || ''}</div>
            </div>
          </div>
          ` : ''}

          ${workExperience.some(exp => exp.position || exp.company) ? `
          <div class="section">
            <h3 class="section-title">Work Experience</h3>
            ${workExperience.filter(exp => exp.position || exp.company).map(exp => `
              <div class="experience-item">
                <div class="experience-title">${exp.position || ''}</div>
                <div class="experience-company">${exp.company || ''}</div>
                <div class="experience-dates">${exp.startDate || ''} - ${exp.endDate || ''}${exp.location ? ` | ${exp.location}` : ''}</div>
                ${exp.description ? `<div class="experience-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${basic.name || 'resume'}.doc`);
  };

  const handleDownloadPPT = () => {
    if (!token) {
      alert("Please log in to download your resume.");
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${basic.name || 'Resume'} - Resume</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .slide {
              background: white;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 40px;
              margin-bottom: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              min-height: 400px;
            }
            .header-slide {
              text-align: center;
              background: linear-gradient(135deg, #007bff, #0056b3);
              color: white;
              padding: 60px 40px;
            }
            .name {
              font-size: 36px;
              font-weight: bold;
              margin: 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .title {
              font-size: 24px;
              margin: 10px 0;
              opacity: 0.9;
            }
            .contact {
              font-size: 16px;
              margin: 20px 0;
            }
            .content-slide {
              padding: 40px;
            }
            .section-title {
              font-size: 28px;
              font-weight: bold;
              color: #007bff;
              border-bottom: 3px solid #007bff;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .skill-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            .skill-item {
              background: #e3f2fd;
              padding: 10px 15px;
              border-radius: 20px;
              text-align: center;
              font-weight: bold;
              color: #1976d2;
            }
            .experience-item {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 5px solid #007bff;
            }
            .experience-title {
              font-size: 20px;
              font-weight: bold;
              color: #007bff;
              margin: 0;
            }
            .experience-company {
              font-size: 16px;
              color: #666;
              margin: 5px 0;
            }
            .experience-dates {
              font-size: 14px;
              color: #888;
              margin: 5px 0;
            }
            .experience-description {
              margin-top: 15px;
              font-size: 16px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="slide header-slide">
            <h1 class="name">${basic.name || 'Your Name'}</h1>
            <h2 class="title">${basic.title || 'Job Title'}</h2>
            <div class="contact">
              ${basic.email ? `📧 ${basic.email}` : ''} ${basic.phone ? `📱 ${basic.phone}` : ''} ${basic.location ? `📍 ${basic.location}` : ''}
            </div>
          </div>

          ${summary ? `
          <div class="slide content-slide">
            <h3 class="section-title">Professional Summary</h3>
            <p style="font-size: 18px; line-height: 1.8;">${summary.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}

          ${skills ? `
          <div class="slide content-slide">
            <h3 class="section-title">Skills</h3>
            <div class="skill-grid">
              ${skills.split(',').map(skill => `<div class="skill-item">${skill.trim()}</div>`).join('')}
            </div>
          </div>
          ` : ''}

          ${(education.degree || education.school) ? `
          <div class="slide content-slide">
            <h3 class="section-title">Education</h3>
            <div class="experience-item">
              <div class="experience-title">${education.degree || ''}</div>
              <div class="experience-company">${education.school || ''}</div>
              <div class="experience-dates">${education.startYear || ''} - ${education.endYear || ''}</div>
            </div>
          </div>
          ` : ''}

          ${workExperience.some(exp => exp.position || exp.company) ? `
          <div class="slide content-slide">
            <h3 class="section-title">Work Experience</h3>
            ${workExperience.filter(exp => exp.position || exp.company).map(exp => `
              <div class="experience-item">
                <div class="experience-title">${exp.position || ''}</div>
                <div class="experience-company">${exp.company || ''}</div>
                <div class="experience-dates">${exp.startDate || ''} - ${exp.endDate || ''}${exp.location ? ` | ${exp.location}` : ''}</div>
                ${exp.description ? `<div class="experience-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${basic.name || 'resume'}.ppt`);
  };

  return (
    <section className="resume-hero">
      <h1 style={{
        textAlign: 'center',
        fontSize: '3rem',
        color: '#2c3e50',
        marginBottom: '30px',
        fontWeight: '700',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        background: 'linear-gradient(45deg, #3498db, #e74c3c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        Resume Builder
      </h1>
      {/* TEMPLATES SECTION */}
      <div className="resume-templates-section">
        <h2 className="resume-section-title">Choose Your Template</h2>
        <p className="resume-section-subtitle">Select a professional design that matches your style</p>
        <div className="template-gallery">
          {TEMPLATE_LIST.map((tpl) => (
            <div
              key={tpl.id}
              className={`template-card ${
                selectedLayout === tpl.id ? "template-card-active" : ""
              }`}
            >
              <div className={`template-thumbnail thumb-${tpl.id}`} />
              <h4 className="template-name">{tpl.name}</h4>
              <button
                type="button"
                className="template-use-btn"
                onClick={() => setSelectedLayout(tpl.id)}
              >
                Use this template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="resume-main-content">
        {/* RESUME BUILDER SECTION */}
        <div className="resume-builder-section">
          <div className="resume-builder-header">
            <h2 className="resume-builder-title">Build Your Resume</h2>
            <p className="resume-builder-subtitle">Fill in your details and see your resume update in real-time</p>
          </div>

          {/* Content auto‑fill templates */}
          <div className="resume-form-group">
            <h3 className="resume-form-heading">Quick Start Templates</h3>
            <div className="resume-template-row">
              {RESUME_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  className={`resume-template-btn ${
                    selectedTemplate === tpl.id ? "template-active" : ""
                  }`}
                  onClick={() => applyTemplate(tpl.id)}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
            <p className="resume-hint">
              Click a template to auto-fill the form with sample data
            </p>
          </div>

          {/* Basic Info (Contact) */}
          <div className="resume-form-group">
            <h3 className="resume-form-heading">Contact Information</h3>
            <div className="resume-form-grid">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={basic.name}
                onChange={handleBasicChange}
              />
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={basic.title}
                onChange={handleBasicChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={basic.email}
                onChange={handleBasicChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={basic.phone}
                onChange={handleBasicChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={basic.location}
                onChange={handleBasicChange}
              />
            </div>
          </div>

          {/* Summary (Profile) */}
          <div className="resume-form-group">
            <h3 className="resume-form-heading">Professional Summary</h3>
            <textarea
              rows="3"
              placeholder="Write a brief summary about yourself, your experience, and career goals..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* Skills */}
          <div className="resume-form-group">
            <h3 className="resume-form-heading">Skills</h3>
            <input
              type="text"
              placeholder="e.g. JavaScript, React, Node.js, Python (comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          {/* Work Experience */}
          <div className="resume-form-group">
            <h3 className="resume-form-heading">Work Experience</h3>
            {workExperience.map((exp, index) => (
              <div key={index} className="resume-project-block">
                <div className="resume-form-grid">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.position}
                    onChange={(e) => handleWorkExperienceChange(index, "position", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Start Date (e.g. Jan 2023)"
                    value={exp.startDate}
                    onChange={(e) => handleWorkExperienceChange(index, "startDate", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="End Date (e.g. Present)"
                    value={exp.endDate}
                    onChange={(e) => handleWorkExperienceChange(index, "endDate", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) => handleWorkExperienceChange(index, "location", e.target.value)}
                  />
                </div>
                <textarea
                  rows="3"
                  placeholder="Describe your responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => handleWorkExperienceChange(index, "description", e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="resume-form-group">
            <h3 className="resume-form-heading">Education</h3>
            <div className="resume-form-grid">
              <input
                type="text"
                name="degree"
                placeholder="Degree (e.g. Bachelor of Science)"
                value={education.degree}
                onChange={handleEducationChange}
              />
              <input
                type="text"
                name="school"
                placeholder="School/University Name"
                value={education.school}
                onChange={handleEducationChange}
              />
              <input
                type="text"
                name="startYear"
                placeholder="Start Year"
                value={education.startYear}
                onChange={handleEducationChange}
              />
              <input
                type="text"
                name="endYear"
                placeholder="End Year"
                value={education.endYear}
                onChange={handleEducationChange}
              />
            </div>
          </div>
        </div>

        {/* PREVIEW SECTION - SEPARATE */}
        <div className="resume-preview-section">
          <div className="resume-preview-header">
            <div className="preview-info">
              <h3 className="resume-preview-title">Live Preview</h3>
              <p className="resume-preview-subtitle">Your resume updates as you type</p>
            </div>
            <div className="download-options">
              <button
                type="button"
                className="resume-action-btn download-btn"
                onClick={() => setShowDownloadModal(true)}
              >
                📄 Download Resume
              </button>
            </div>
          </div>
          <div className="resume-preview-card" ref={previewRef}>
            <ActiveLayout
              basic={basic}
              summary={summary}
              skillList={skillList}
              education={education}
              workExperience={workExperience}
            />
          </div>
        </div>

        {/* DOWNLOAD MODAL */}
        {showDownloadModal && (
          <div className="download-modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }} onClick={() => setShowDownloadModal(false)}>
            <div className="download-modal-content" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              animation: 'modalFadeIn 0.3s ease-out'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title" style={{
                textAlign: 'center',
                marginBottom: '20px',
                color: '#333',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>Download Your Resume</h3>
              <div className="modal-preview" style={{
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                backgroundColor: '#f9f9f9',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <ActiveLayout
                  basic={basic}
                  summary={summary}
                  skillList={skillList}
                  education={education}
                  workExperience={workExperience}
                />
              </div>
              <div className="modal-download-options" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  className="modal-download-btn pdf-btn"
                  onClick={handleDownloadPDF}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  📄 Download PDF
                </button>
                <button
                  type="button"
                  className="modal-download-btn word-btn"
                  onClick={handleDownloadWord}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  📝 Download Word
                </button>
                <button
                  type="button"
                  className="modal-download-btn ppt-btn"
                  onClick={handleDownloadPPT}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  📊 Download PPT
                </button>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowDownloadModal(false)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '5px'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="resume-actions-section">
        <div className="resume-actions-container">
          <button
            type="button"
            className="resume-action-btn save-btn"
            onClick={saveToStorage}
          >
            💾 Save Progress
          </button>
          <button
            type="button"
            className="resume-action-btn clear-btn"
            onClick={clearAll}
          >
            🗑️ Clear All
          </button>
          <button
            type="button"
            className="resume-action-btn download-btn"
            onClick={() => setShowDownloadModal(true)}
          >
            📄 Download Resume
          </button>
        </div>
      </div>
    </section>
  );
}

export default ResumeSection;
