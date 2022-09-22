import Edit from "./Edit";

import "./index.scss";

wp.blocks.registerBlockType("actorapi/actorapi", {
  title: "Actor",
  icon: "admin-users",
  category: "common",
  attributes: {
    name: {
      type: "string",
      default: "Christian",
    },
    lastName: {
      type: "string",
      default: "Bale",
    },
  },
  edit: Edit,
  save: SaveActor,
});

function SaveActor(props) {
  return <div class="actor" data-name={JSON.stringify(props.attributes)}></div>;
}
