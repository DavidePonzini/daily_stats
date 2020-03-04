function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Fitbit Account</Text>}>
        <Oauth
          settingsKey="oauth"
          title="Get Access Token"
          label="Food"
          status="OAuth"
          authorizeUrl="https://www.fitbit.com/oauth2/authorize"
          requestTokenUrl="https://api.fitbit.com/oauth2/token"
          clientId="22BB79"
          clientSecret="e9973a9a5e5fef8367d4c00285a3d290"
          scope="nutrition"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
