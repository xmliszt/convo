import { redirect } from 'next/navigation';

type PageProps = {
  params: {
    scenario_id: string;
  };
};

export default function Page(props: PageProps) {
  redirect(`/scenarios/${props.params.scenario_id}/chat`);
}
