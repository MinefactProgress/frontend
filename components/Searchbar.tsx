import { ActionIcon, Autocomplete } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { Search, ArrowRight, X } from "tabler-icons-react";

const Searchbar = () => {
  const router = useRouter();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [search, setSearch] = useState("");
  const { data: districts } = useSWR(shouldFetch ? "/api/districts/get" : null);

  const loadDistricts = () => {
    setShouldFetch(true);
  };
  const handleSearch = () => {
    if (search.match(/^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/)) {
      // Lat Lon
      const coords = search.split(",");
      coords.forEach((e: string) => parseFloat(e));
      fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/search/" +
          coords[0] +
          "/" +
          coords[1],
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            showNotification({
              title: "Error occurred",
              message: "An unexpected error occurred while finding the block",
              color: "red",
              icon: <X />,
            });
          } else {
            if (!res.block || !res.district) {
              showNotification({
                title: "Block not found",
                message: "Could not find a block for the given coordinates",
                color: "red",
                icon: <X />,
              });
            } else {
              router.push(
                "/districts/" + res.district.name + "/" + res.block.id
              );
            }
          }
          setSearch("");
        });
    } else {
      // District name
      const district = districts?.find(
        (d: any) => d.name.toLowerCase() === search.split(" (")[0].toLowerCase()
      );

      if (district) {
        router.push("/districts/" + district.name);
      } else {
        showNotification({
          title: "Nothing found",
          message: "Please check your search and try again",
          color: "red",
          icon: <X />,
        });
      }
    }
  };

  return (
    <Autocomplete
      icon={<Search size={18} />}
      radius="xl"
      size="md"
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color="blue"
          variant="filled"
          onClick={() => handleSearch()}
        >
          <ArrowRight size={18} />
        </ActionIcon>
      }
      value={search}
      onChange={setSearch}
      onFocus={loadDistricts}
      data={
        (search.trim().length > 0 &&
          districts
            ?.filter(
              (district: any) =>
                !districts.some((d: any) => d.parent === district.id)
            )
            .map((district: any) => {
              const filter = districts?.filter(
                (d: any) => d.name === district.name
              );
              if (filter.length > 1) {
                return `${district.name} (${
                  districts?.find((d: any) => d.id === district.parent).name
                })`;
              }
              return district.name;
            })
            .sort((a: string, b: string) => {
              if (
                a.toLowerCase().indexOf(search.toLowerCase()) >
                b.toLowerCase().indexOf(search.toLowerCase())
              ) {
                return 1;
              } else if (
                a.toLowerCase().indexOf(search.toLowerCase()) <
                b.toLowerCase().indexOf(search.toLowerCase())
              ) {
                return -1;
              } else {
                if (a > b) {
                  return 1;
                } else {
                  return -1;
                }
              }
            })) ||
        []
      }
      placeholder="Search District, Location (Lat, Lon)..."
      rightSectionWidth={42}
      transition="scale"
      transitionDuration={200}
      style={{ width: "50vh" }}
    />
  );
};

export default Searchbar;
