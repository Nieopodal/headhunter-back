export const getAvatar = async (userName: string): Promise<boolean> => {
  if (!userName) return true;
  const resp = await fetch(`https://github.com/${userName}`);
  return resp.status === 404;
};
