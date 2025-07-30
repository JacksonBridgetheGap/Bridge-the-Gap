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
          id
          username
          photo
          events {
            start
            end
            groupID
            text
          }
        }
        posts {
          id
          title
          img
          description
          author
        }
        events {
          id
          text
          start
          end
          participants {
            id
          }
        }
        }
      }`;
};
