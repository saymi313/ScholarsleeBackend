import "../../../index.css"
import PageHeader from "../../components/ContactComponents/PageHeader"
import ContactInfo from "../../components/ContactComponents/ContactInfo"
import ContactForm from "../../components/ContactComponents/ContactForm"
import Header from "../../components/Shared/Header"

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-gray-50 py-10 px-4 md:py-14">
        <div className="max-w-6xl mx-auto">
          <PageHeader />

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[380px_1fr]">
              <ContactInfo />
              <ContactForm />
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
