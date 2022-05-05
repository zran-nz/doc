/*eslint-disable */
const App = () => {
  window.drawRef = React.useRef(null);
  const excalidrawRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({width: undefined, height: undefined})
  const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
  const [zenModeEnabled, setZenModeEnabled] = React.useState(false);
  const [gridModeEnabled, setGridModeEnabled] = React.useState(false);

  React.useEffect(() => {
    const { width, height } = excalidrawRef.current.getBoundingClientRect()
    setDimensions({ width, height });
    const onResize = () => {
      const { width, height } = excalidrawRef.current.getBoundingClientRect()
      setDimensions({ width, height });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [excalidrawRef]);
  return React.createElement(React.Fragment, null,
    React.createElement("div", {
      className: "excalidraw-wrapper",
      ref: excalidrawRef
    }, React.createElement(Excalidraw.default,{
      ref: drawRef,
      initialData,
      // onChange: (elements, state) => console.log("Elements :", elements, "State : ", state),
      // onPointerUpdate: (payload) => console.log(payload),
      onCollabButtonClick: () => window.alert("You clicked on collab button"),
      viewModeEnabled: viewModeEnabled,
      zenModeEnabled: zenModeEnabled,
      gridModeEnabled: gridModeEnabled,
    }))
  );
};

const main = async function() {
  const ubj = new URL(location.href)
  const src = ubj.searchParams.get('src')
  if (src) {
    window.initialData = await fetch(src, {json:true}).then(r=>r.json())
    // console.log(Excalidraw.exportToSvg(initialData));
  } else window.initialData = {}
  ReactDOM.render(React.createElement(App), document.getElementById("app"));
}
main()

window.addEventListener('message', async function(e) {
  if (!e.data) return drawRef.current.resetScene()
  const rs = await fetch(e.data, {json:true}).then(r=>r.json())
  drawRef.current.updateScene(rs)
});