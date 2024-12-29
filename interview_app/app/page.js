import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./dashboard/_components/Header";
import Footer from "./dashboard/_components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <section className="mt-16 max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Choose Interview Pro?
          </h2>
          <p className="text-gray-600 mb-8">
            Interview Pro helps you practice and refine your interview skills
            through real-time feedback, personalized question sets, and
            performance tracking. Whether you're preparing for your first
            interview or looking to improve, our app provides the tools you need
            to succeed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Real-Time Feedback
              </h3>
              <p className="text-gray-600">
                Get immediate feedback on your answers to improve your responses
                and boost your confidence.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Personalized Questions
              </h3>
              <p className="text-gray-600">
                Practice with questions tailored to your career level and the
                job you're aiming for.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Track Your Progress
              </h3>
              <p className="text-gray-600">
                Monitor your improvement over time and identify areas for
                further development.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
