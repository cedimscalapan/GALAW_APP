import { IonIcon } from '@ionic/react';
import { chevronBackOutline, menuOutline, notificationsOutline } from 'ionicons/icons';
import { exportBackup, restoreBackup, syncPending } from '../services/tamsStore';
import SyncControl from './SyncControl';

const appLogo = '/assets/APPLOGO.png';

type Props = {
  back?: boolean;
};

export default function AppTopBar({ back = false }: Props) {
  return (
    <div className="top-bar">
      <button className="icon-button" aria-label={back ? 'Go back' : 'Data settings'} onClick={() => { if(back){history.back();return} const action=prompt('TAMS data tools:\n1. Export backup\n2. Restore backup'); if(action==='1'||action?.toLowerCase()==='export'){exportBackup();return} if(action==='2'||action?.toLowerCase()==='restore'){const input=document.createElement('input');input.type='file';input.accept='application/json';input.onchange=()=>{const file=input.files?.[0];if(file)restoreBackup(file).then(()=>alert('TAMS backup restored.')).catch(()=>alert('This file is not a valid TAMS backup.'))};input.click()} }}>
        <IonIcon icon={back ? chevronBackOutline : menuOutline} />
      </button>
      <div className="brand-lockup">
        <img src={appLogo} alt="TAMS app logo" />
        <strong>TAMS</strong>
      </div>
      <div className="top-actions">
        <SyncControl />
        <button className="icon-button" aria-label="Settings" onClick={() => { const action=prompt('TAMS: 1 Export backup | 2 Restore backup | 3 Sync now');if(action==='1'){exportBackup()}else if(action==='2'){const input=document.createElement('input');input.type='file';input.accept='application/json';input.onchange=()=>{const f=input.files?.[0];if(f)restoreBackup(f).then(()=>alert('Backup restored.')).catch(()=>alert('Invalid backup file.'))};input.click()}else if(action==='3'){syncPending().then(r=>alert(r.ok?'TAMS data synced.':`Sync unavailable: ${r.reason}`))} }}>
          <IonIcon icon={notificationsOutline} />
        </button>
        <img className="avatar" src={appLogo} alt="TAMS profile mark" />
      </div>
    </div>
  );
}

