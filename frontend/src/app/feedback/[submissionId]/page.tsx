import { FeedbackView } from '@/components/FeedbackView';
export default function FeedbackPage({ params }: { params: { submissionId: string } }) { return <FeedbackView submissionId={params.submissionId} />; }
