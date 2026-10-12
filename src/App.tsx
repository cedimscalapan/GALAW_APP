import { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  barbellOutline,
  fastFoodOutline,
  fitnessOutline,
  homeOutline,
  statsChartOutline,
} from 'ionicons/icons';

import Home from './pages/Home';
import Workout from './pages/Workout';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';
import Nutrition from './pages/Nutrition';
import { installAutoSync } from './services/tamsStore';

export default function App() {
  useEffect(() => installAutoSync(), []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home" component={Home} />
            <Route exact path="/workout" component={Workout} />
            <Route exact path="/workout/edit/:id" component={Workout} />
            <Route exact path="/exercises" component={Exercises} />
            <Route exact path="/progress" component={Progress} />
            <Route exact path="/nutrition" component={Nutrition} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="workout" href="/workout">
              <IonIcon icon={barbellOutline} />
              <IonLabel>Workout</IonLabel>
            </IonTabButton>
            <IonTabButton tab="exercises" href="/exercises">
              <IonIcon icon={fitnessOutline} />
              <IonLabel>Exercises</IonLabel>
            </IonTabButton>
            <IonTabButton tab="progress" href="/progress">
              <IonIcon icon={statsChartOutline} />
              <IonLabel>Progress</IonLabel>
            </IonTabButton>
            <IonTabButton tab="nutrition" href="/nutrition">
              <IonIcon icon={fastFoodOutline} />
              <IonLabel>Nutrition</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
