export default function SignInButton({ loading = false, disabled = false }) {
    return (
      <button
        type="submit"
        disabled={disabled || loading}
        className={`w-full ${
          disabled || loading 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-[#5D38DE] hover:bg-[#4A2BB8] active:scale-[0.98]'
        } text-white font-semibold py-3 rounded-lg transition-all duration-200 font-['Poppins']`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </div>
        ) : (
          'Sign in'
        )}
      </button>
    )
  }
  