'use client'
import { useState } from "react";
import Image from "next/image";
import { FileText, X, Linkedin } from "lucide-react";
import references from "@/data/references.json";

interface ReferencesModalProps {
  className?: string;
  buttonClassName?: string;
  modalClassName?: string;
}

export function ReferencesModal({ 
  className = "", 
  buttonClassName = "", 
  modalClassName = "" 
}: ReferencesModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating References Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-pink-400 to-fuchsia-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium z-40 ${buttonClassName}`}
      >
        <FileText className="h-5 w-5" />
        <span className="hidden sm:inline">Read References</span>
      </button>

      {/* References Modal */}
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${modalClassName}`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">References</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {references.map((reference) => (
                  <div key={reference.id} className="group bg-gray-50 rounded-xl p-6 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={reference.image}
                            alt={reference.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reference.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {reference.position} at {reference.company}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {reference.relationship} • {reference.project} • {reference.date}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <a 
                          href={reference.linkedinUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      </div>
                    </div>
                    <blockquote className="mt-4 text-gray-700 italic border-l-4 border-black pl-4">
                      &ldquo;{reference.testimonial}&rdquo;
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 