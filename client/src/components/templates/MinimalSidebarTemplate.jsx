// src/components/templates/MinimalSidebarTemplate.jsx

function MinimalSidebarTemplate({ basic, summary, skillList, education, workExperience }) {
  return (
    <div className="tpl tpl-minimal">
      <aside className="ms-left">
        <h1 className="ms-name">{basic.name || "Your Name"}</h1>
        <h2 className="ms-title">
          {basic.title || "Software Engineer"}
        </h2>

        <div className="ms-block">
          <h3>Contact</h3>
          <ul>
            {basic.email && <li>{basic.email}</li>}
            {basic.phone && <li>{basic.phone}</li>}
            {basic.location && <li>{basic.location}</li>}
          </ul>
        </div>

        {skillList.length > 0 && (
          <div className="ms-block">
            <h3>Skills</h3>
            <ul className="ms-skill-list">
              {skillList.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <main className="ms-right">
        {summary && (
          <section className="ms-section">
            <h3>Summary</h3>
            <p>{summary}</p>
          </section>
        )}

        {(education.school || education.degree) && (
          <section className="ms-section">
            <h3>Education</h3>
            <p className="ms-edu-degree">
              {education.degree || "Degree"}
            </p>
            <p className="ms-edu-school">
              {education.school || "College / University"}
            </p>
            {(education.startYear || education.endYear) && (
              <p className="ms-edu-dates">
                {education.startYear} – {education.endYear || "Present"}
              </p>
            )}
          </section>
        )}

        {workExperience.some((exp) => exp.company || exp.position || exp.description) && (
          <section className="ms-section">
            <h3>Work Experience</h3>
            {workExperience.map(
              (exp, i) =>
                (exp.company || exp.position || exp.description) && (
                  <div key={i} className="ms-experience">
                    {(exp.position || exp.company) && (
                      <p className="ms-exp-position">
                        {exp.position}
                        {exp.position && exp.company && " at "}
                        {exp.company}
                      </p>
                    )}
                    {(exp.startDate || exp.endDate) && (
                      <p className="ms-exp-dates">
                        {exp.startDate} – {exp.endDate || "Present"}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                    )}
                    {exp.description && <p className="ms-exp-description">{exp.description}</p>}
                  </div>
                )
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default MinimalSidebarTemplate;