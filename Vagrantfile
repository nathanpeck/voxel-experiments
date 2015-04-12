# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"
MEMORY = `sysctl -n hw.memsize`.to_i / 1024 / 1024 / 2
CPUS = `sysctl -n hw.ncpu`.to_i

# Port 8080 for the client
# Port 8081 for the server
FORWARD_PORTS = [8080, 8081]

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.

  config.ssh.forward_agent = true

  FORWARD_PORTS.each do |port|
    config.vm.network :forwarded_port, host: port, guest: port
  end

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:

  if ENV['VM'] == "virtualbox"
      config.vm.box = "ubuntu/trusty32"
      config.vm.provider "virtualbox" do |v, override|
        v.memory = MEMORY
        v.cpus = CPUS
      end
  else
      config.vm.box = "parallels/ubuntu-14.04"
      config.vm.provider "parallels" do |v, override|
        v.update_guest_tools = true
        v.memory = MEMORY
        v.cpus = CPUS
      end
  end

  config.vm.provision :shell, path: "guest.sh", privileged: false
end