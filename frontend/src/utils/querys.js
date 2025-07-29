export const createGroupQuery = (id) => {
  return `
  query {
      group(id: ${id}) {
        id
        name
        prompt
        promptLastUpdate
        averageOffsetUTC
        members {
          username
          photo
        }
        posts {
          title
          img
          description
          author
        }
        events {
          text
          start
          end
        }
        }
      }`;
};
