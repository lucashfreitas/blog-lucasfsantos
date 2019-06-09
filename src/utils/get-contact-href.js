// @flow
const getContactHref = (name: string, contact: string) => {
  let href;

  switch (name) {
    case 'twitter':
      href = `https://www.twitter.com/${contact}`;
      break;
    case 'github':
      href = `https://github.com/${contact}`;
      break;
    case 'vkontakte':
      href = `https://vk.com/${contact}`;
      break;
    case 'telegram':
      href = `telegram:${contact}`;
      break;
    case 'email':
      href = `mailto:${contact}`;
      break;
    case 'stackoverflow':
      href = `${contact}`;
      break;
    case 'medium':
      href = `https://medium.com/@${contact}`;
      break;
    case 'linkedin':
      href = `${contact}`;
      break;
    default:
      href = contact;
      break;
  }

  return href;
};

export default getContactHref;
