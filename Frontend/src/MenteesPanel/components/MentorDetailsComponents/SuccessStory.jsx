const SuccessStory = ({ mentorData }) => {
  const successStory = mentorData?.successStory || {}
  const title = successStory.title || 'My Success Story'
  const content = successStory.content || 'No success story available yet.'
  const isPublished = successStory.isPublished || false
  
  return (
    <div className="max-w-4xl">
      <div className="border-2 border-[#5D38DE] rounded-2xl p-8 bg-white">
        <h2 className="text-2xl font-semibold text-[#5D38DE] mb-6">{title}</h2>

        <div className="space-y-6 text-gray-800 leading-relaxed">
          {/* Success Story Content */}
          <div>
            <p className="mt-2 whitespace-pre-line">
              {content}
            </p>
          </div>
          
          {!isPublished && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">This success story is not yet published.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuccessStory
