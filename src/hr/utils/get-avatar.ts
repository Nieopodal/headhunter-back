export const getAvatar = async (userName: string): Promise<boolean> => {
  const resp = await fetch(`https://github.com/${userName}`);
  return resp.status === 404;
};
