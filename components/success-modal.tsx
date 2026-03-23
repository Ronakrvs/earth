"use client"

import * as Dialog from '@radix-ui/react-dialog'
import { CheckCircle2 } from "lucide-react"

function SuccessModal({ isOpen, onClose, title = "Thank You!", description = "Your Inquiry has been submitted. We’ll be in touch shortly." }: { 
  isOpen: boolean; 
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-300 border border-green-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">{title}</Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-8 leading-relaxed">
              {description}
            </Dialog.Description>
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Continue
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default SuccessModal
