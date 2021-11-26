package config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

@Service
public class FirebaseInitializer implements InitializingBean {

    @Override
    public void afterPropertiesSet() throws Exception {
        FileInputStream serviceAccount;

        try {
            File file = ResourceUtils.getFile("classpath:serviceAccountKey.json");
            serviceAccount = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return;
        }

        FirebaseOptions options;

        try {
            options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        FirebaseApp.initializeApp(options);
    }
}
