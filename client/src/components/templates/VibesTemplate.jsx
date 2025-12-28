// src/components/templates/VibesTemplate.jsx

function VibesTemplate({ basic, summary, skillList, education, workExperience }) {
  return (
    <div className="tpl tpl-vibes">
      {/* Left colored column */}
      <aside className="vibes-left">
        <div className="vibes-header-block">
          <h1 className="vibes-name">{basic.name || "Your Name"}</h1>
          <h2 className="vibes-title">
            {basic.title || "Full‑Stack Developer"}
          </h2>
        </div>

        <div className="vibes-section">
          <h3 className="vibes-section-title">Contact</h3>
          <ul className="vibes-list">
            {basic.email && <li>{basic.email}</li>}
            {basic.phone && <li>{basic.phone}</li>}
            {basic.location && <li>{basic.location}</li>}
          </ul>
        </div>

        {skillList.length > 0 && (
          <div className="vibes-section">
            <h3 className="vibes-section-title">Skills</h3>
            <ul className="vibes-tag-list">
              {skillList.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Right main content */}
      <main className="vibes-right">
        {summary && (
          <section className="vibes-main-section">
            <h3 className="vibes-main-title">Profile</h3>
            <p className="vibes-text">{summary}</p>
          </section>
        )}

        {workExperience.some((exp) => exp.company || exp.position || exp.description) && (
          <section className="vibes-main-section">
            <h3 className="vibes-main-title">Work Experience</h3>
            {workExperience.map(
              (exp, i) =>
                (exp.company || exp.position || exp.description) && (
                  <div key={i} className="vibes-work-exp">
                    <div className="vibes-work-header">
                      <p className="vibes-work-position">{exp.position || "Position"}</p>
                      <p className="vibes-work-company">{exp.company || "Company"}</p>
                      <p className="vibes-work-dates">
                        {exp.startDate || exp.endDate ? `${exp.startDate || ""} – ${exp.endDate || "Present"}` : ""}
                      </p>
                      {exp.location && <p className="vibes-work-location">{exp.location}</p>}
                    </div>
                    {exp.description && <p className="vibes-text">{exp.description}</p>}
                  </div>
                )
            )}
          </section>
        )}

        {(education.school || education.degree) && (
          <section className="vibes-main-section">
            <h3 className="vibes-main-title">Education</h3>
            <div className="vibes-edu-item">
              <p className="vibes-edu-degree">
                {education.degree || "Degree"}
              </p>
              <p className="vibes-edu-school">
                {education.school || "College / University"}
              </p>
              {(education.startYear || education.endYear) && (
                <p className="vibes-edu-dates">
                  {education.startYear} –{" "}
                  {education.endYear || "Present"}
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default VibesTemplate;
