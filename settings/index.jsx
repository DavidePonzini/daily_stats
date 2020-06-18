function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Authentication</Text>}>
        <Oauth
          settingsKey="oauth"
          label="Get Access Token"
          status="Login"
          authorizeUrl="https://www.fitbit.com/oauth2/authorize"
          requestTokenUrl="https://api.fitbit.com/oauth2/token"
          clientId="22BB79"
          clientSecret="e9973a9a5e5fef8367d4c00285a3d290"
          scope="nutrition"
        />
      </Section>
      <Section
        title={<Text bold align="center">Food</Text>}>
        <TextInput
          label="Calories deficit"
          placeholder="0"
          type="number"
          settingsKey="calories-deficit"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
