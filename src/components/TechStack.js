import skills from "@/data/skills";


const TechStack = () => {
  return (
    <div id="project" className="flex flex-col items-center w-full justify-between text-left gap-6 px-10">
      <h1 className="tracking-tight underline items-start w-full text-xl font-semibold">Skills</h1>
      <div className="flex flex-wrap flex-row items-start w-full gap-3">
        {skills.map((skill, index) => (
          <div key={index} className="px-2 py-1 flex flex-row gap-2 items-center text-sm border border-primary text-primary w-fit hover:bg-secondary">
            <img src={skill.icon} className="h-5 w-5" alt={skill.name} />
            <h3>{skill.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechStack;
