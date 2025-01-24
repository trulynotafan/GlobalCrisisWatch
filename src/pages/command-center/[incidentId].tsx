import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import CommandCenterLayout from '@/components/CommandCenter/CommandCenterLayout';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

interface CommandCenterPageProps {
  incident: any;
  teams: any[];
  resources: any[];
  tasks: any[];
}

const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  incident,
  teams,
  resources,
  tasks
}) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <CommandCenterLayout
      incident={incident}
      teams={teams}
      resources={resources}
      tasks={tasks}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const { incidentId } = context.params as { incidentId: string };

  try {
    const [incident, teams, resources, tasks] = await Promise.all([
      prisma.incident.findUnique({
        where: { id: incidentId },
        include: {
          alerts: true,
          predictions: true,
        },
      }),
      prisma.team.findMany({
        where: {
          assignments: {
            some: {
              incidentId,
            },
          },
        },
      }),
      prisma.resource.findMany({
        where: {
          assignments: {
            some: {
              incidentId,
            },
          },
        },
      }),
      prisma.task.findMany({
        where: {
          incidentId,
        },
      }),
    ]);

    if (!incident) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        incident: JSON.parse(JSON.stringify(incident)),
        teams: JSON.parse(JSON.stringify(teams)),
        resources: JSON.parse(JSON.stringify(resources)),
        tasks: JSON.parse(JSON.stringify(tasks)),
      },
    };
  } catch (error) {
    console.error('Error fetching command center data:', error);
    return {
      notFound: true,
    };
  }
};

export default CommandCenterPage; 