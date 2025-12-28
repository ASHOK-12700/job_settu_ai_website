// src/components/templates/CompactProfessionalTemplate.jsx

function CompactProfessionalTemplate({ basic, summary, skillList, education, workExperience }) {
  return (
    <div className="tpl tpl-compact">
      <header className="cp-header">
        <h1 className="cp-name">{basic.name || "Your Name"}</h1>
        <p className="cp-title">
          {basic.title || "IT Professional"}
        </p>
        <p className="cp-contact">
          {[basic.email, basic.phone, basic.location]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      <div className="cp-row">
        {summary && (
          <section className="cp-section cp-summary">
            <h3>Summary</h3>
            <p>{summary}</p>
          </section>
        )}

        {skillList.length > 0 && (
          <section className="cp-section cp-skills">
            <h3>Key Skills</h3>
            <div className="cp-skill-tags">
              {skillList.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="cp-row">
        {(education.school || education.degree) && (
          <section className="cp-section cp-edu">
            <h3>Education</h3>
            <p className="cp-edu-degree">
              {education.degree || "Degree"}
            </p>
            <p className="cp-edu-school">
              {education.school || "College / University"}
            </p>
            {(education.startYear || education.endYear) && (
              <p className="cp-edu-dates">
                {education.startYear} – {education.endYear || "Present"}
              </p>
            )}
          </section>
        )}

        {workExperience.some((exp) => exp.company || exp.position || exp.description) && (
          <section className="cp-section cp-projects">
            <h3>Work Experience</h3>
            {workExperience.map(
              (exp, i) =>
                (exp.company || exp.position || exp.description) && (
                  <div key={i} className="cp-experience">
                    {(exp.position || exp.company) && (
                      <p className="cp-exp-position">
                        {exp.position}
                        {exp.position && exp.company && " at "}
                        {exp.company}
                      </p>
                    )}
                    {(exp.startDate || exp.endDate) && (
                      <p className="cp-exp-dates">
                        {exp.startDate} – {exp.endDate || "Present"}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                    )}
                    {exp.description && <p className="cp-exp-description">{exp.description}</p>}
                  </div>
                )
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default CompactProfessionalTemplate;