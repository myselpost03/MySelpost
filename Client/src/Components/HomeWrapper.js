import { useEffect, useState } from 'react';
import { GuestUser } from '../Pages';
import { Russian } from '../Pages';
import { isTelegram } from '../Utils/useIsTelegram';

const HomeWrapper = () => {
  const [isIndia, setIsIndia] = useState(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        setIsIndia(data.country === 'IN');
      })
      .catch(() => {
        setIsIndia(false);
      });
  }, []);

  // optional loading state
  if (isIndia === null) return null;

  if (isTelegram && isIndia) {
    return <GuestUser />;
  }

  return <Russian />;
};

export default HomeWrapper;
