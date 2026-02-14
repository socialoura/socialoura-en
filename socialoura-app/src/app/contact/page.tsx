import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Mail, Users } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with contact image */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/contactIcons.webp"
                alt="Contact our team"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Contactez-nous
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Notre équipe est prête à vous aider pour quoi que ce soit.
              Remplissez simplement le formulaire et nous vous contacterons dès
              que possible.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Chat 24/7 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-gradient rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Chat 24/7
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Discutez en ligne avec notre support.
              </p>
              <button className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
                Commencer à discuter →
              </button>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-gradient rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm mb-2">
                Écrivez-nous à{" "}
                <span className="font-semibold text-gray-900">
                  info@socialoura.fr
                </span>{" "}
                ou remplissez le formulaire
              </p>
              <button className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
                Remplir le formulaire →
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h2>
            <form className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Décrivez votre demande en détail..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-gradient text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Tous nos services sont fonctionnels
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
