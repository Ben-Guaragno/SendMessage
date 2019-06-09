var colorArray=[
  {color: 'red'},
  {color: 'orange'},
  {color: 'green'},
  {color: 'aquamarine'},
  {color: 'deepskyblue'},
  {color: 'plum'},
  {color: 'tomato'},
  {color: 'sandybrown'}
]

function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Message 1</Text>}>
        <TextInput
          settingsKey="Label1"
          label="Label:"
        />
        <TextInput
          settingsKey="URL1"
          label="URL:"
          disabled={!(props.settings.Blast1 === "false")}
          type="url"
        />
        <TextInput
          settingsKey="Data1"
          label="Data:"
        />
        <TextInput
          settingsKey="Headers1"
          label="Headers:"
        />
        <ColorSelect
          settingsKey="Color1"
          colors={colorArray}
          centered
        />
        <Toggle
          settingsKey="Blast1"
          label="Blast"
        />
        
        {props.settings.Blast1!=null && JSON.parse(props.settings.Blast1) &&
        <AdditiveList
          settingsKey="BlastURL1"
          addAction={
            <TextInput
              title="Add URL"
              label="Add URL"
              placeholder="URL"
              type="url"
            />
          }
          renderItem={({name}) =>
            <Text>{name}</Text>
          }
        />
        }
        
      </Section>
      <Section
        title={<Text bold align="center">Message 2</Text>}>
        <TextInput
          settingsKey="Label2"
          label="Label:"
        />
        <TextInput
          settingsKey="URL2"
          label="URL:"
          disabled={!(props.settings.Blast2 === "false")}
          type="url"
        />
        <TextInput
          settingsKey="Data2"
          label="Data:"
        />
        <TextInput
          settingsKey="Headers2"
          label="Headers:"
        />
        <ColorSelect
          settingsKey="Color2"
          colors={colorArray}
          centered
        />
        <Toggle
          settingsKey="Blast2"
          label="Blast"
        />
        
        {props.settings.Blast2!=null && JSON.parse(props.settings.Blast2) &&
        <AdditiveList
          settingsKey="BlastURL2"
          addAction={
            <TextInput
              title="Add URL"
              label="Add URL"
              placeholder="URL"
              type="url"
            />
          }
          renderItem={({name}) =>
            <Text>{name}</Text>
          }
        />
        }
        
      </Section>
      <Section
        title={<Text bold align="center">Message 3</Text>}>
        <TextInput
          settingsKey="Label3"
          label="Label:"
        />
        <TextInput
          settingsKey="URL3"
          label="URL:"
          disabled={!(props.settings.Blast3 === "false")}
          type="url"
        />
        <TextInput
          settingsKey="Data3"
          label="Data:"
        />
        <TextInput
          settingsKey="Headers3"
          label="Headers:"
        />
        <ColorSelect
          settingsKey="Color3"
          colors={colorArray}
          centered
        />
        <Toggle
          settingsKey="Blast3"
          label="Blast"
        />
        
        
        
        {props.settings.Blast3!=null && JSON.parse(props.settings.Blast3) &&
        <AdditiveList
          settingsKey="BlastURL3"
          addAction={
            <TextInput
              title="Add URL"
              label="Add URL"
              placeholder="URL"
              type="url"
            />
          }
          renderItem={({name}) =>
            <Text>{name}</Text>
          }
        />
        }
        
      </Section>
      <Section
        title={<Text bold align="center">Blast URLs</Text>}>
        <AdditiveList
          settingsKey="BlastURL"
          title="Test Title"
          addAction={
            <TextInput
              title="Add URL"
              label="Add URL"
              placeholder="URL"
              type="url"
            />
          }
          renderItem={({name}) =>
//            <TextImageRow
//              label={"URL: "+name}
//            />
            <Text>{name}</Text>
          }
        />
        <Text>
          Setting a Message to blast will send an identical request to every listed URL.
          Note that the URL listed in the respective message's section will NOT be included in the blast.
        </Text>
      </Section>
      <Section
        title={<Text bold align="center">Instructions</Text>}>
        <Text>
          This is an HTTP/HTTPS client supporting GET and POST requests (though HTTP only works to IP addresses on your own network).
          It is intended for a technically proficient audience and use of its more advanced features requires some understanding of JSON 
          data structures.
          The app allows configuration with three sets of label, URL, data segment (for POST) and headers. Touching that label will then 
          fire off the associated request, and the status text returned will be displayed on the watch and can be dismissed by touching it.
          For example, the label might be 'Send help!' and the URL/data fields contain the request details to send this message to a service 
          that creates a text message (to which you would need to subscribe). 
          The URL is something like 'https://server.domain.com/path' and the data might look something like {"{'key':'message','value':'Help!'} "} 
          or {"{'key':'message','value':'~Lbl'} "} (where ~Lbl is substitited with the label text).
          To test your requests, you might want to use the free testing service at https://www.requestcatcher.com.
          The Pebble version of this app could also substitute location-specific information.  I may implement this later if there's enough interest.
        </Text>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
