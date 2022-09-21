import "./index.scss";

wp.blocks.registerBlockType("weatherapi/weatherapi", {
  title: "Weather",
  icon: "cloud",
  category: "common",
  edit: Edit,
  save: SaveSlide,
});

function Edit(props) {
  return <h1>test backend</h1>;
}

function SaveSlide(props) {
  return <h1>test frontend</h1>;
}
