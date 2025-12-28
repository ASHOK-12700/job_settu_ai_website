// src/components/templates/ClassicTemplate.jsx
function ClassicTemplate({ basic, summary, skillList, education, workExperience }) {
  return (
    <div className="tpl tpl-classic">
      <header className="tpl-header">
        <h1>{basic.name || "Your Name"}</h1>
        <h2>{basic.title || "Software Engineer / Student"}</h2>
        <p className="tpl-contact">
          {[basic.email, basic.phone, basic.location].filter(Boolean).join(" · ")}
        </p>
      </header>

      {summary && (
        <section className="tpl-section">
          <h3>Profile</h3>
          <p>{summary}</p>
        </section>
      )}

      {skillList.length > 0 && (
        <section className="tpl-section">
          <h3>Skills</h3>
          <ul className="tpl-skill-list">
            {skillList.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {workExperience.some((exp) => exp.company || exp.position || exp.description) && (
        <section className="tpl-section">
          <h3>Work Experience</h3>
          {workExperience.map(
            (exp, i) =>
              (exp.company || exp.position || exp.description) && (
                <div key={i} className="tpl-work-exp">
                  <div className="tpl-work-header">
                    <p className="tpl-work-position">{exp.position || "Position"}</p>
                    <p className="tpl-work-company">{exp.company || "Company"}</p>
                    <p className="tpl-work-dates">
                      {exp.startDate || exp.endDate ? `${exp.startDate || ""} – ${exp.endDate || "Present"}` : ""}
                    </p>
                    {exp.location && <p className="tpl-work-location">{exp.location}</p>}
                  </div>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              )
          )}
        </section>
      )}

      {(education.school || education.degree) && (
        <section className="tpl-section">
          <h3>Education</h3>
          <p className="tpl-edu-degree">{education.degree || "Degree"}</p>
          <p className="tpl-edu-school">
            {education.school || "College / University"}
          </p>
          {(education.startYear || education.endYear) && (
            <p className="tpl-edu-dates">
              {education.startYear} – {education.endYear || "Present"}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default ClassicTemplate;
