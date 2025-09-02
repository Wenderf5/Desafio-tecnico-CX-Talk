import style from './index.module.css';
import type { user } from '../..';
import { photoArray } from '../../../../../../storage/profilePhotos';
import { Circle } from 'lucide-react';

interface props {
    userData: user
}

export function User({ userData }: props) {
    const profilePhoto = photoArray.find(photo => photo.id === userData.photo);

    return (
        <div className={style.cardUser}>
            <div className={style.containerProfilePhoto}>
                <img
                    className={style.profilePhoto}
                    src={profilePhoto?.photo}
                    alt="User photo"
                />
            </div>
            <div className={style.summary}>
                <p className={style.userName}>{userData.name}</p>
                <p className={style.status}>
                    {userData.status === "offline" ? <Circle color='red' size={8} /> : <Circle color='green' size={8} />}
                    {userData.status}
                </p>
            </div>
        </div >
    );
}