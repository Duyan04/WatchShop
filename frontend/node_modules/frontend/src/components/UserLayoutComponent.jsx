import FooterComponent from "./FooterComponent";
import HeaderComponent from "./HeaderComponent";

function UserLayoutComponent({
  children,
  countOrder,
  currentUser,
  setCurrentUser,
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <HeaderComponent
          countOrder={countOrder}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
        <div>{children}</div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default UserLayoutComponent;
