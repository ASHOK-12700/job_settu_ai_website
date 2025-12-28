// src/components/templates/ModernTwoColumnTemplate.jsx

function ModernTwoColumnTemplate({ basic, summary, skillList, education, workExperience }) {
  return (
    <div className="tpl tpl-modern-two">
      <header className="mt-header">
        <div>
          <h1 className="mt-name">{basic.name || "Your Name"}</h1>
          <h2 className="mt-title">
            {basic.title || "Full‑Stack Developer"}
          </h2>
        </div>
        <div className="mt-contact">
          {basic.email && <span>{basic.email}</span>}
          {basic.phone && <span> · {basic.phone}</span>}
          {basic.location && <span> · {basic.location}</span>}
        </div>
      </header>

      <div className="mt-body">
        {/* Left column */}
        <aside className="mt-left">
          {skillList.length > 0 && (
            <section className="mt-section">
              <h3>Skills</h3>
              <ul className="mt-skill-list">
                {skillList.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {(education.school || education.degree) && (
            <section className="mt-section">
              <h3>Education</h3>
              <p className="mt-edu-degree">
                {education.degree || "Degree"}
              </p>
              <p className="mt-edu-school">
                {education.school || "College / University"}
              </p>
              {(education.startYear || education.endYear) && (
                <p className="mt-edu-dates">
                  {education.startYear} – {education.endYear || "Present"}
                </p>
              )}
            </section>
          )}
        </aside>

        {/* Right column */}
        <main className="mt-right">
          {summary && (
            <section className="mt-section">
              <h3>Profile</h3>
              <p>{summary}</p>
            </section>
          )}

          {workExperience.some((exp) => exp.company || exp.position || exp.description) && (
            <section className="mt-section">
              <h3>Work Experience</h3>
              {workExperience.map(
                (exp, i) =>
                  (exp.company || exp.position || exp.description) && (
                    <div key={i} className="mt-experience">
                      {(exp.position || exp.company) && (
                        <p className="mt-exp-position">
                          {exp.position}
                          {exp.position && exp.company && " at "}
                          {exp.company}
                        </p>
                      )}
                      {(exp.startDate || exp.endDate) && (
                        <p className="mt-exp-dates">
                          {exp.startDate} – {exp.endDate || "Present"}
                          {exp.location && ` · ${exp.location}`}
                        </p>
                      )}
                      {exp.description && <p className="mt-exp-description">{exp.description}</p>}
                    </div>
                  )
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default ModernTwoColumnTemplate;