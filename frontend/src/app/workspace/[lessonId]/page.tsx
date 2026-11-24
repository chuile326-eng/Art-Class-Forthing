import WorkspaceClient from '@/components/Workspace';
export default function WorkspacePage({ params, searchParams }: { params: { lessonId: string }; searchParams?: { mode?: string } }) {
  return <WorkspaceClient lessonId={params.lessonId} mode={searchParams?.mode} />;
}
