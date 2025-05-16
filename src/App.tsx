const App = () => {
  const name = "john";
  const age = 30;
  return (
    <div className=" flex items-center justify-center  h-screen w-screen bg-gradient-to-bl from-blue-200 to-purple-500">
      {name + "   " + age}
    </div>
  );
};

export default App;
