/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2017-present TagSpaces UG (haftungsbeschraenkt)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License (version 3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uuidv1 from 'uuid';
import IconButton from '@material-ui/core/IconButton';
import NewFileIcon from '@material-ui/icons/Add';
import LocationsIcon from '@material-ui/icons/WorkOutline';
import TagLibraryIcon from '@material-ui/icons/LocalOfferOutlined';
import SearchIcon from '@material-ui/icons/SearchOutlined';
// import PerspectivesIcon from '@material-ui/icons/MapOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import ThemingIcon from '@material-ui/icons/InvertColors';
import UpgradeIcon from '@material-ui/icons/FlightTakeoff';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { withTheme } from '@material-ui/core/styles';
import SplitPane from 'react-split-pane';
import LogoIcon from '../assets/images/icon100x100.svg';
import TagLibrary from '../components/TagLibrary';
import Search from '../components/Search';
import PerspectiveManager from '../components/PerspectiveManager';
import LocationManager from '../components/LocationManager';
import HelpFeedbackPanel from '../components/HelpFeedbackPanel';
import i18n from '../services/i18n';
import { Pro } from '../pro';
import { type Tag } from '../reducers/taglibrary';
import {
  actions as AppActions,
  getDirectoryPath,
  isSettingsDialogOpened,
  isLocationManagerPanelOpened,
  isTagLibraryPanelOpened,
  isSearchPanelOpened,
  isPerspectivesPanelOpened,
  isHelpFeedbackPanelOpened,
  isReadOnlyMode,
} from '../reducers/app';
import { actions as SettingsActions, isFirstRun } from '../reducers/settings';
import LoadingLazy from './LoadingLazy';

const ProTeaserDialog = React.lazy(() => import(/* webpackChunkName: "ProTeaserDialog" */ './dialogs/ProTeaserDialog'));
const ProTeaserDialogAsync = props => (
  <React.Suspense fallback={<LoadingLazy />}>
    <ProTeaserDialog {...props} />
  </React.Suspense>
);

type Props = {
  theme: Object,
  isFirstRun: boolean,
  directoryPath: string,
  setFirstRun: (isFirstRun: boolean) => void,
  toggleOnboardingDialog: () => void,
  toggleCreateFileDialog: () => void,
  toggleAboutDialog: () => void,
  toggleKeysDialog: () => void,
  toggleSettingsDialog: () => void,
  isSettingsDialogOpened: () => void,
  isLocationManagerPanelOpened: boolean,
  openLocationManagerPanel: () => void,
  isTagLibraryPanelOpened: boolean,
  openTagLibraryPanel: () => void,
  isSearchPanelOpened: boolean,
  openSearchPanel: () => void,
  isPerspectivesPanelOpened: boolean,
  // openPerspectivesPanel: () => void,
  isHelpFeedbackPanelOpened: boolean,
  openHelpFeedbackPanel: () => void,
  closeAllVerticalPanels: () => void,
  openFileNatively: (url: string) => void,
  openURLExternally: (url: string) => void,
  switchTheme: () => void,
  showNotification: (message: string) => void,
  isReadOnlyMode: boolean
};

type State = {
  isProTeaserVisible: boolean // evtl. redux migration
};

class VerticalNavigation extends React.Component<Props, State> {
  state = {
    isProTeaserVisible: false
  };

  styles = {
    panel: {
      height: '100%',
      backgroundColor: '#2C001E' // 'rgb(89, 89, 89)' // '#00D1A1' // #008023
    },
    buttonIcon: {
      width: 28,
      height: 28,
      color: '#d6d6d6' // this.props.theme.palette.text.primary
    },
    button: {
      padding: 8,
      width: 44,
      height: 44
    },
    selectedButton: {
      borderRadius: 0,
      backgroundColor: '#880E4F'
    },
    settingsButton: {
      position: 'absolute',
      bottom: 0,
      left: 0
    },
    themingButton: {
      position: 'absolute',
      bottom: 45,
      left: 0
    },
    upgradeButton: {
      position: 'absolute',
      bottom: 90,
      left: 0
    }
  };

  toggleProTeaser = () => {
    this.setState({ isProTeaserVisible: !this.state.isProTeaserVisible });
  }

  render() {
    const {
      isFirstRun,
      isLocationManagerPanelOpened,
      isTagLibraryPanelOpened,
      isSearchPanelOpened,
      isSettingsDialogOpened,
      isPerspectivesPanelOpened,
      isHelpFeedbackPanelOpened,
      isReadOnlyMode,
      toggleCreateFileDialog,
      toggleAboutDialog,
      toggleOnboardingDialog,
      toggleSettingsDialog,
      toggleKeysDialog,
      openLocationManagerPanel,
      openTagLibraryPanel,
      openSearchPanel,
      openHelpFeedbackPanel,
      closeAllVerticalPanels,
      switchTheme,
      openFileNatively,
      openURLExternally,
      showNotification,
      directoryPath,
      setFirstRun,
      theme
    } = this.props;
    return (
      <div>
        <style>
          {`
            #verticalNavButton:hover {
              border-radius: 0;
              background-color: #880E4F;
            }
          `}
        </style>
        {this.state.isProTeaserVisible && (
          <ProTeaserDialogAsync
            open={this.state.isProTeaserVisible}
            onClose={this.toggleProTeaser}
            openURLExternally={openURLExternally}
            key={uuidv1()}
          />
        )}
        <SplitPane
          split="vertical"
          minSize={44}
          maxSize={44}
          defaultSize={44}
          resizerStyle={{ backgroundColor: theme.palette.divider }}
        >
          <div style={this.styles.panel}>
            <IconButton
              onClick={toggleAboutDialog}
              style={{ ...this.styles.button, marginTop: 10, marginBottom: 16 }}
              title={i18n.t('core:aboutTitle')}
              data-tid="aboutTagSpaces"
            >
              <img
                style={{
                  ...this.styles.buttonIcon,
                  color: this.props.theme.palette.text.primary
                }}
                src={LogoIcon}
                alt="TagSpaces Logo"
              />
            </IconButton>
            <IconButton
              id="verticalNavButton"
              onClick={() => {
                if (isReadOnlyMode || !directoryPath) {
                  showNotification('You are in read-only mode or there is no opened location');
                } else {
                  toggleCreateFileDialog();
                }
              }}
              style={{ ...this.styles.button, marginBottom: 20 }}
              title={i18n.t('core:createFileTitle')}
              data-tid="locationManager"
            >
              <NewFileIcon style={this.styles.buttonIcon} />
            </IconButton>
            <IconButton
              id="verticalNavButton"
              onClick={() => {
                if (isLocationManagerPanelOpened) {
                  closeAllVerticalPanels();
                } else {
                  openLocationManagerPanel();
                }
              }}
              style={
                isLocationManagerPanelOpened
                  ? { ...this.styles.button, ...this.styles.selectedButton }
                  : this.styles.button
              }
              title={i18n.t('core:locationManager')}
              data-tid="locationManager"
            >
              <LocationsIcon style={this.styles.buttonIcon} />
            </IconButton>
            <IconButton
              id="verticalNavButton"
              title={i18n.t('core:tagGroupOperations')}
              data-tid="tagLibrary"
              onClick={() => {
                if (isTagLibraryPanelOpened) {
                  closeAllVerticalPanels();
                } else {
                  openTagLibraryPanel();
                }
              }}
              style={
                isTagLibraryPanelOpened
                  ? { ...this.styles.button, ...this.styles.selectedButton }
                  : this.styles.button
              }
            >
              <TagLibraryIcon style={this.styles.buttonIcon} />
            </IconButton>
            <IconButton
              id="verticalNavButton"
              title={i18n.t('core:searchTitle')}
              data-tid="search"
              onClick={() => {
                if (isSearchPanelOpened) {
                  closeAllVerticalPanels();
                } else {
                  openSearchPanel();
                }
              }}
              style={
                isSearchPanelOpened
                  ? { ...this.styles.button, ...this.styles.selectedButton }
                  : this.styles.button
              }
            >
              <SearchIcon style={this.styles.buttonIcon} />
            </IconButton>
            {/* <IconButton
              title={i18n.t('core:perspectiveManager')}
              data-tid="perspectiveManager"
              onClick={() => {
                if (isPerspectivePanelOpened) {
                  closeAllVerticalPanels();
                } else {
                  openPerspectivesPanel();
                }
              }}
              disabled={false}
              style={
                isPerspectivePanelOpened
                  ? { ...this.styles.button, ...this.styles.selectedButton }
                  : this.styles.button
              }
            >
              <PerspectivesIcon style={this.styles.buttonIcon} />
            </IconButton> */}
            <IconButton
              id="verticalNavButton"
              title={i18n.t('core:helpFeedback')}
              data-tid="helpFeedback"
              onClick={() => {
                if (isHelpFeedbackPanelOpened) {
                  closeAllVerticalPanels();
                } else {
                  openHelpFeedbackPanel();
                }
              }}
              style={
                isHelpFeedbackPanelOpened
                  ? { ...this.styles.button, ...this.styles.selectedButton }
                  : this.styles.button
              }
            >
              <HelpIcon style={this.styles.buttonIcon} />
            </IconButton>
            {!Pro && (
              <IconButton
                id="verticalNavButton"
                title={i18n.t('core:upgradeToPro')}
                data-tid="upgradeToPro"
                onClick={this.toggleProTeaser}
                style={{ ...this.styles.button, ...this.styles.upgradeButton }}
              >
                <UpgradeIcon style={{
                  ...this.styles.buttonIcon,
                  // color: '1DD19F'
                }}
                />
              </IconButton>
            )}
            <IconButton
              id="verticalNavButton"
              title={i18n.t('core:switchTheme')}
              data-tid="switchTheme"
              onClick={switchTheme}
              style={{ ...this.styles.button, ...this.styles.themingButton }}
            >
              <ThemingIcon style={this.styles.buttonIcon} />
            </IconButton>
            <IconButton
              id="verticalNavButton"
              title={i18n.t('core:settings')}
              data-tid="settings"
              onClick={toggleSettingsDialog}
              style={
                isSettingsDialogOpened
                  ? {
                    ...this.styles.button,
                    ...this.styles.settingsButton,
                    ...this.styles.selectedButton
                  } : {
                    ...this.styles.button,
                    ...this.styles.settingsButton
                  }
              }
            >
              <SettingsIcon style={this.styles.buttonIcon} />
            </IconButton>
          </div>
          <div style={this.styles.panel}>
            <LocationManager style={{ display: isLocationManagerPanelOpened ? 'block' : 'none' }} />
            { isTagLibraryPanelOpened && <TagLibrary /> }
            <Search style={{ display: isSearchPanelOpened ? 'block' : 'none' }} />
            { isPerspectivesPanelOpened && <PerspectiveManager /> }
            { isHelpFeedbackPanelOpened && <HelpFeedbackPanel
              openFileNatively={openFileNatively}
              openURLExternally={openURLExternally}
              toggleAboutDialog={toggleAboutDialog}
              toggleKeysDialog={toggleKeysDialog}
              toggleOnboardingDialog={toggleOnboardingDialog}
              toggleProTeaser={this.toggleProTeaser}
            /> }
          </div>
        </SplitPane>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFirstRun: isFirstRun(state),
    isSettingsDialogOpened: isSettingsDialogOpened(state),
    isLocationManagerPanelOpened: isLocationManagerPanelOpened(state),
    isTagLibraryPanelOpened: isTagLibraryPanelOpened(state),
    isSearchPanelOpened: isSearchPanelOpened(state),
    isPerspectivesPanelOpened: isPerspectivesPanelOpened(state),
    isHelpFeedbackPanelOpened: isHelpFeedbackPanelOpened(state),
    isReadOnlyMode: isReadOnlyMode(state),
    directoryPath: getDirectoryPath(state),
  };
}

function mapActionCreatorsToProps(dispatch) {
  return bindActionCreators(
    {
      toggleCreateFileDialog: AppActions.toggleCreateFileDialog,
      toggleOnboardingDialog: AppActions.toggleOnboardingDialog,
      toggleSettingsDialog: AppActions.toggleSettingsDialog,
      toggleAboutDialog: AppActions.toggleAboutDialog,
      toggleKeysDialog: AppActions.toggleKeysDialog,
      openLocationManagerPanel: AppActions.openLocationManagerPanel,
      openTagLibraryPanel: AppActions.openTagLibraryPanel,
      openSearchPanel: AppActions.openSearchPanel,
      openPerspectivesPanel: AppActions.openPerspectivesPanel,
      openHelpFeedbackPanel: AppActions.openHelpFeedbackPanel,
      openFileNatively: AppActions.openFileNatively,
      openURLExternally: AppActions.openURLExternally,
      closeAllVerticalPanels: AppActions.closeAllVerticalPanels,
      showNotification: AppActions.showNotification,
      switchTheme: SettingsActions.switchTheme,
      setFirstRun: SettingsActions.setFirstRun,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapActionCreatorsToProps
)(withTheme(VerticalNavigation));
