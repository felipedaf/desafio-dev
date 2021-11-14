import formatter from './formatter';

export default (content) => {
  if (content[content.length - 1] == '\n')
    content = content.substring(0, content.length - 1);
  const registrations = content.split('\n');

  const asObjects = registrations.map((registration) =>
    formatter(registration),
  );

  return asObjects;
};
