package com.civilportal;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import ir.map.sdk_map.Mapir;

import com.rnimmersive.RNImmersivePackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.modules.i18nmanager.I18nUtil;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RCTMGLPackage(),
                    new VectorIconsPackage(),
                    new RNFirebasePackage(),
                    new RNFirebaseNotificationsPackage(),
                    new RNFirebaseMessagingPackage(),
                    new RNImmersivePackage(),
                    new SplashScreenReactPackage(),
                    new RNGestureHandlerPackage(),
                    new LinearGradientPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Mapir.getInstance(this, "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjgxMWE5MTE3MmJjODI3ZDc2MzIzZjdkNTVjNTM0ZDk3ZDYzN2VkNjBiM2MyY2JhYjg0YTE5NmE0YTJiYjliNTllM2QzMmI3NTgzZGUyYTc5In0.eyJhdWQiOiI3NzkwIiwianRpIjoiODExYTkxMTcyYmM4MjdkNzYzMjNmN2Q1NWM1MzRkOTdkNjM3ZWQ2MGIzYzJjYmFiODRhMTk2YTRhMmJiOWI1OWUzZDMyYjc1ODNkZTJhNzkiLCJpYXQiOjE1ODA2NjYzMjEsIm5iZiI6MTU4MDY2NjMyMSwiZXhwIjoxNTgzMTcxOTIxLCJzdWIiOiIiLCJzY29wZXMiOlsiYmFzaWMiXX0.A8OkM6OasTFBHdxOuVCIt6rDgMse9TClabc-xs_nedzoFuy219gacEkmiJpDszsgv5UBqdsoBITnty7X_AF7dJGorrTRon0RGeBM0fv5u7qP1LMa8_iFZ4IwrKI0TsiVwuXqBuknduoGe-b2XMyoF7p4X3pcHq2rJLAy-CFBYAQd372Nbzub2r8wBxsmmyJ7I1b53mAqdRJVSAo1tIgP0d5nbaS7FUeIOk7TnHlpzA8qdWD3yoSqiuCqx5r0wohoKPL_YEENkWpo2vLyvzL5G23_2CzEYRXFAau20gKLmO0dBO3mUPL6goX0I1EBSDVyEnjA7AFGjiYoL-_dlZhOdQ");

        I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
        sharedI18nUtilInstance.allowRTL(getApplicationContext(), false);


        SoLoader.init(this, /* native exopackage */ false);
    }
}
