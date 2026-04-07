import TestimonialForm from '@/components/TestimonialForm';

export default function CollectionPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Leave a Testimonial
            </h1>
            <p className="text-gray-600">
              We&apos;d love to hear about your experience!
            </p>
          </div>
          <TestimonialForm />
        </div>
      </div>
    </main>
  );
}
