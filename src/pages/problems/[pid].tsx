import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";
import React from "react";

type ProblemPageProps = {
	problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
	const hasMounted = useHasMounted();
	if (!hasMounted) return null;

	return (
		<div>
			<Topbar problemPage />
			<Workspace problem={problem} />
		</div>
	);
};

export default ProblemPage;

// Fetch local data with SSG
export async function getStaticPaths() {
	console.log("Problems Object:", problems); // Debugging

	const paths = Object.keys(problems).map((key) => ({
		params: { pid: key },
	}));

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }: { params: { pid: string } }) {
	const { pid } = params;
	console.log("Fetching problem for pid:", pid); // Debugging

	const problem = problems[pid];

	if (!problem) {
		console.error(`Problem not found for pid: ${pid}`);
		return { notFound: true };
	}

	// Convert handlerFunction safely
	const problemData = { 
		...problem, 
		handlerFunction: problem.handlerFunction ? problem.handlerFunction.toString() : null
	};

	return {
		props: {
			problem: problemData,
		},
	};
}
