import { FeedbackView } from '@/components/FeedbackView';
export default function SubmissionPage({ params }: { params: { id: string } }) { return <FeedbackView submissionId={params.id} />; }
