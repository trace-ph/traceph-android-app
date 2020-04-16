import {insertContacts} from '../apis/contact';

export default function uploadContact(contactArr, BackgroundTimer) {
  return new Promise((resolve, reject) => {
    let cancel = {exec: null};
    const contactTOId = BackgroundTimer.setTimeout(() => {
      console.log('timeout');
      cancel.exec();
      reject('error sis');
    }, 5000);

    insertContacts(
      {
        contacts: contactArr,
      },
      cancel,
    )
      .then(res => {
        console.log('axios connected', [res.status]);
        BackgroundTimer.clearTimeout(contactTOId);
        resolve([]);
      })
      .catch(err => {
        if (err.response) {
          console.log('insert err', err.response.status, err.response.data);
          reject('error sis');
        }
      });
  });
}
