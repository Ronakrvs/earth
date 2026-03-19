import * as Dialog from '@radix-ui/react-dialog'



function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
            <Dialog.Title className="text-2xl font-bold text-green-700 mb-4">🎉 Thank You!</Dialog.Title>
            <Dialog.Description className="text-gray-700 mb-6">
              Your Inquiry has been submitted. We’ll be in touch shortly.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default SuccessModal