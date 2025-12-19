import React from 'react'

const Background = ({ mentorData }) => {
    const background = mentorData?.background || ''
    const bio = mentorData?.bio || ''
    const education = mentorData?.education || []
    const experience = mentorData?.experience || []
    
    return (
      <div className="max-w-4xl">
        {/* Summary Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-[#5D38DE]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-[#5D38DE] font-semibold text-sm uppercase tracking-wide">SUMMARY</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {background || bio || 'No background information available.'}
          </p>
        </div>
  
        {/* Education Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-[#5D38DE]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <h2 className="text-[#5D38DE] font-semibold text-sm uppercase tracking-wide">EDUCATION</h2>
          </div>
  
          <div className="space-y-6">
            {education.length > 0 ? (
              education.map((edu, index) => {
                const initials = edu.institution ? edu.institution.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 3) : '?'
                const bgColors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600']
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${bgColors[index % bgColors.length]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-sm">{initials}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{edu.degree}</h3>
                      <p className="text-gray-600 mb-1">{edu.institution}</p>
                      <p className="text-gray-500 text-sm">{edu.year || 'Unknown'}</p>
                      {edu.field && <p className="text-gray-600 text-sm mt-2">Focus: {edu.field}</p>}
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 italic">No education information available.</p>
            )}
          </div>
        </div>
  
        {/* Experience Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-[#5D38DE]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1zm4 3H6v10h8V6z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-[#5D38DE] font-semibold text-sm uppercase tracking-wide">EXPERIENCE</h2>
          </div>
  
          <div className="space-y-8">
            {experience.length > 0 ? (
              experience.map((exp, index) => {
                const initials = exp.company ? exp.company.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : '?'
                const bgColors = ['bg-red-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500']
                const startYear = exp.startDate ? new Date(exp.startDate).getFullYear() : ''
                const endYear = exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')
                const duration = exp.duration || (startYear && endYear ? `${startYear} - ${endYear}` : 'Unknown')
                
                return (
                  <React.Fragment key={index}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${bgColors[index % bgColors.length]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-sm">{initials}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{exp.position}</h3>
                        <p className="text-gray-600 mb-1">{exp.company}</p>
                        <p className="text-gray-500 text-sm">{duration}</p>
                        {exp.description && (
                          <p className="text-gray-600 text-sm mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < experience.length - 1 && (
                      <div className="border-l-2 border-gray-200 ml-6 h-8"></div>
                    )}
                  </React.Fragment>
                )
              })
            ) : (
              <p className="text-gray-500 italic">No experience information available.</p>
            )}
          </div>
        </div>
  
        {/* Skills Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-[#5D38DE]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6zm0 4h8v2H6V8zm0 4h8v2H6v-2z" />
            </svg>
            <h2 className="text-[#5D38DE] font-semibold text-sm uppercase tracking-wide">SKILLS</h2>
          </div>
  
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { skill: "Designing", percentage: 80 },
              { skill: "Programming", percentage: 75 },
              { skill: "HTML", percentage: 70 },
              { skill: "CSS", percentage: 70 },
              { skill: "SEO", percentage: 70 },
            ].map(({ skill, percentage }) => (
              <div key={skill} className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    {/* Progress circle */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#5D38DE"
                      strokeWidth="2"
                      strokeDasharray={`${percentage}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                  </div>
                </div>
                <span className="text-sm text-gray-700 text-center">{skill}</span>
              </div>
            ))}
          </div>
  
          <div>
            <h3 className="text-[#5D38DE] font-medium mb-4">Usairam also knows about</h3>
            <div className="flex flex-wrap gap-2">
              {["Essay writing", "Letter of Recommendation", "SOP", "IELTS", "Visa Process", "Appointment interview"].map(
                (skill) => (
                  <span key={skill} className="bg-[#5D38DE] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
  
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-[#5D38DE]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h2 className="text-[#5D38DE] font-semibold text-sm uppercase tracking-wide">HONORS & AWARDS</h2>
          </div>
  
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Dean's List Recognition</h3>
                <p className="text-gray-600 mb-1">FAST NUCES, Islamabad</p>
                <p className="text-gray-500 text-sm">2020, 2021</p>
                <p className="text-gray-600 text-sm mt-2">
                  Recognized for academic excellence with CGPA above 3.5 for consecutive semesters.
                </p>
              </div>
            </div>
  
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Best Final Year Project Award</h3>
                <p className="text-gray-600 mb-1">FAST NUCES, Islamabad</p>
                <p className="text-gray-500 text-sm">2022</p>
                <p className="text-gray-600 text-sm mt-2">
                  Awarded for developing an AI-powered recommendation system for e-commerce platforms.
                </p>
              </div>
            </div>
  
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">DAAD Scholarship Recipient</h3>
                <p className="text-gray-600 mb-1">German Academic Exchange Service</p>
                <p className="text-gray-500 text-sm">2023</p>
                <p className="text-gray-600 text-sm mt-2">
                  Awarded full scholarship for Master's studies in Germany based on academic merit and potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Background
  