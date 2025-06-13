import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface NavigationParams {
  [key: string]: any;
}

export interface NavigationState {
  screen: string;
  params?: NavigationParams;
  timestamp: number;
}

interface NavigationContextType {
  currentScreen: string;
  navigateTo: (screen: string, params?: NavigationParams) => void;
  goBack: () => void;
  screenParams: NavigationParams | null;
  screenHistory: NavigationState[];
  canGoBack: boolean;
  resetNavigation: () => void;
  replaceScreen: (screen: string, params?: NavigationParams) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenParams, setScreenParams] = useState<NavigationParams | null>(null);
  const [screenHistory, setScreenHistory] = useState<NavigationState[]>([
    { screen: 'home', timestamp: Date.now() }
  ]);

  const navigateTo = useCallback((screen: string, params?: NavigationParams) => {
    console.log('NavigationContext: navigating to', screen, 'with params:', params);
    
    const newState: NavigationState = {
      screen,
      params,
      timestamp: Date.now()
    };

    setScreenHistory(prev => {
      const newHistory = [...prev, newState];
      console.log('NavigationContext: new history:', newHistory);
      return newHistory;
    });
    
    setCurrentScreen(screen);
    setScreenParams(params || null);
    console.log('NavigationContext: current screen set to:', screen);
  }, []);

  const goBack = useCallback(() => {
    if (screenHistory.length > 1) {
      const newHistory = screenHistory.slice(0, -1);
      const previousState = newHistory[newHistory.length - 1];
      
      setScreenHistory(newHistory);
      setCurrentScreen(previousState.screen);
      setScreenParams(previousState.params || null);
      
      console.log('NavigationContext: going back to:', previousState.screen);
    }
  }, [screenHistory]);

  const replaceScreen = useCallback((screen: string, params?: NavigationParams) => {
    console.log('NavigationContext: replacing current screen with', screen);
    
    const newState: NavigationState = {
      screen,
      params,
      timestamp: Date.now()
    };

    setScreenHistory(prev => {
      const newHistory = [...prev.slice(0, -1), newState];
      return newHistory;
    });
    
    setCurrentScreen(screen);
    setScreenParams(params || null);
  }, []);

  const resetNavigation = useCallback(() => {
    console.log('NavigationContext: resetting navigation to home');
    const homeState: NavigationState = {
      screen: 'home',
      timestamp: Date.now()
    };
    
    setScreenHistory([homeState]);
    setCurrentScreen('home');
    setScreenParams(null);
  }, []);

  const canGoBack = screenHistory.length > 1;

  return (
    <NavigationContext.Provider value={{
      currentScreen,
      navigateTo,
      goBack,
      screenParams,
      screenHistory,
      canGoBack,
      resetNavigation,
      replaceScreen
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}; 