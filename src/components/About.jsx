export default function About() {
  return (
    <div className="about-container">
      <h1>About Pebli</h1>
      {/* eslint-disable react/no-unescaped-entities */}
      <p>
        I've always liked todo and activity tracker apps. But they really didn't
        fit my lifestyle. So I decided to build my own!
      </p>
      <p>
        Pebli is a todo and activity tracker for grownups. People who aren't
        interested in streaks...
      </p>
      <p>There are many ways to use Pebli</p>
      <ul>
        <li>As a todo list. Mark items off as you complete them</li>
        <li>As a counter. How many times have you done a task?</li>
        <li>To bring awareness. Since you can count up or down...</li>
        <li>Set a goal and keep track of how many times you've done it.</li>
        <li>Or as a streak tracker — set a goal and keep count every day</li>
      </ul>
      <p>It's totally up to you!</p>
    </div>
  );
}
