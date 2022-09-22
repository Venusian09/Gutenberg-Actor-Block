import { TextControl } from "@wordpress/components";

function Edit(props) {
  return (
    <div className="actor-details">
      <TextControl
        label="Please insert actor name"
        value={props.attributes.name}
        onChange={(newValue) => props.setAttributes({ name: newValue })}
      />
      <TextControl
        label="Please insert actor lastname"
        value={props.attributes.lastName}
        onChange={(newValue) => props.setAttributes({ lastName: newValue })}
      />
    </div>
  );
}

export default Edit;
