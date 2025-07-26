type LoaderProps = {
  loading?: boolean;
};

export default function Loader(props: LoaderProps) {
  if (!props.loading) {
    return null;
  }
  return <div className="loader">⏳ Загрузка...</div>;
}
