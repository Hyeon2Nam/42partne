import client from './client';

export const getRoomList = () => {
  return client.get(`/api/articles?isComplete=false`);
};

export const getOneRoom = ({ articleId }) => {
  return client.get(`/api/articles/${articleId}`);
};

export const createRoom = async ({ article }) => {
  const articleId = await client
    .post(`/api/articles`, JSON.stringify(article))
    .then((res) => {
      return res.data;
    });
  return getOneRoom(articleId);
};

export const deleteRoom = ({ articleId }) => {
  return client.post(`/api/articles/${articleId}/recoverable-delete`);
};

export const editRoomInfo = async ({ article, articleId }) => {
  await client.put(`/api/articles/${articleId}`, JSON.stringify(article));
  return getOneRoom({ articleId });
};

export const joinRoom = ({ articleId }) => {
  return client.post(`/api/articles/${articleId}/participate`);
};

export const cancleRoom = ({ articleId }) => {
  return client.post(`/api/articles/${articleId}/participate-cancel`);
};

export const completeRoom = ({ articleId }) => {
  return client.post(`/api/articles/${articleId}/complete`);
};
